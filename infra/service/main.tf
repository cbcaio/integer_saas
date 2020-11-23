locals {
  log_formats = {
    JSON = "{ \"requestId\":\"$context.requestId\", \"ip\": \"$context.identity.sourceIp\", \"caller\":\"$context.identity.caller\", \"user\":\"$context.identity.user\", \"requestTime\":\"$context.requestTime\", \"httpMethod\":\"$context.httpMethod\", \"resourcePath\":\"$context.resourcePath\", \"status\":\"$context.status\", \"protocol\":\"$context.protocol\", \"responseLength\":\"$context.responseLength\" }\n"
  }
}
terraform {
  required_version = "~> 0.13.2"
  backend "s3" {
    key = "states/terraform.tfstate"
  }
}

locals {
  db_connection_string  = "mysql://${var.rds_master_username}:${var.rds_master_password}@${aws_db_instance.default.endpoint}/${aws_db_instance.default.name}"
  lambda_zip_path       =   "${path.module}/service-api.zip"
}

# Security Groups
resource "aws_security_group" "lambda" {
  name   = "${var.application_name}-sg"
  vpc_id = data.aws_vpc.default.id

  egress {
    from_port   = 0    # All Ports
    to_port     = 0    # All Ports
    protocol    = "-1" # All Protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "rds" {
  name   = "${var.application_name}-rds"
  vpc_id = data.aws_vpc.default.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "TCP"
    security_groups = [aws_security_group.lambda.id]
  }

  egress {
    from_port   = 0    # All Ports
    to_port     = 0    # All Ports
    protocol    = "-1" # All Protocols
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# -------------------------------- #
# Identity Access Management (IAM) #
# -------------------------------- #

resource "aws_iam_role" "gateway_role" {
  name               = "${var.rest_api_name}_gw_role"
  assume_role_policy = data.template_file.assume_apigateway_role.rendered
}

resource "aws_iam_role_policy_attachment" "allow_push_cloudwatch_logs" {
  role       = aws_iam_role.gateway_role.id
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}

resource "aws_api_gateway_account" "stage" {
  cloudwatch_role_arn = aws_iam_role.gateway_role.arn
}

resource "aws_iam_role" "lambda_execution_role" {
  name               = "${var.lambda_function_name}_execution_role"
  assume_role_policy = data.template_file.assume_lambda_role.rendered
}

resource "aws_iam_role_policy" "cloudwatch_logging" {
  name   = "LambdaCloudwatchLogging"
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.template_file.aws_lambda_basic_execution_role_policy.rendered
}

resource "aws_iam_role_policy" "attach_vpc" {
  # Creates this resource only if subnet_ids is not an empty list
  count = length(data.aws_subnet_ids.default.ids) > 0 ? 1 : 0

  name   = "LambdaAttachToVPC"
  role   = aws_iam_role.lambda_execution_role.id
  policy = data.template_file.aws_lambda_vpc_role_policy.rendered
}

resource "aws_lambda_permission" "allow_api_gateway_trigger" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*/*"
}

# --------------- #
# Lambda Function #
# --------------- #

resource "aws_s3_bucket_object" "deployment_package" {
  count = var.lambda_zip_s3_bucket != "" ? 1 : 0

  bucket = var.lambda_zip_s3_bucket
  key    = var.lambda_zip_s3_key
  source = local.lambda_zip_path

  etag = filemd5(local.lambda_zip_path)
}

resource "aws_lambda_function" "function" {
  function_name = var.lambda_function_name
  description   = "Lambda working as a server running express"
  handler       = "src/lambda/index.handler"
  runtime       = "nodejs12.x"
  role          = aws_iam_role.lambda_execution_role.arn

  filename         = var.lambda_zip_s3_bucket != "" ? null : local.lambda_zip_path
  s3_bucket        = var.lambda_zip_s3_bucket != "" ? aws_s3_bucket_object.deployment_package[0].bucket : null
  s3_key           = var.lambda_zip_s3_key != "" ? aws_s3_bucket_object.deployment_package[0].key : null
  source_code_hash = filebase64sha256(local.lambda_zip_path)
  publish          = true
  memory_size                    = 128
  timeout                        = 30

  environment {
    variables = merge({
      APP_NAME                       = var.application_name
      DB_CONNECTION_STRING           = local.db_connection_string
    })
  }

  vpc_config {
    subnet_ids         = data.aws_subnet_ids.default.ids
    security_group_ids = [aws_security_group.lambda.id]
  }
}

# Creates the REST API Gateway

resource "aws_api_gateway_rest_api" "rest_api" {
  name        = var.rest_api_name
  description = "Integer as a service api"
}

resource "aws_api_gateway_deployment" "stage" {
  # NOTE: passing an empty string as a workaround for this bug: <https://github.com/terraform-providers/terraform-provider-aws/issues/1153>
  stage_name  = ""
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
    redeployment = sha1(join(",", list(
    jsonencode(aws_api_gateway_integration.proxy)
  )))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  stage_name    = "v1"
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  deployment_id = aws_api_gateway_deployment.stage.id

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.access_log_group.arn
    format          = local.log_formats["JSON"]

  }

  depends_on = [
    aws_cloudwatch_log_group.access_log_group,
    aws_cloudwatch_log_group.execution_log_group
  ]
}

resource "aws_api_gateway_usage_plan" "rest_api" {
  name = "${var.rest_api_name}_${aws_api_gateway_stage.stage.stage_name}_plan"

  api_stages {
    api_id = aws_api_gateway_rest_api.rest_api.id
    stage  = aws_api_gateway_stage.stage.stage_name
  }

  quota_settings {
    limit  = 1000
    offset = 0
    period = "DAY"
  }

  throttle_settings {
    burst_limit = 1500
    rate_limit  = 300
  }

  depends_on = [
    aws_api_gateway_stage.stage,
    aws_api_gateway_deployment.stage
  ]
}

resource "aws_api_gateway_api_key" "api_key" {
  name = "${var.rest_api_name}_${aws_api_gateway_stage.stage.stage_name}_key"
}

resource "aws_api_gateway_usage_plan_key" "rest_api" {
  key_id        = aws_api_gateway_api_key.api_key.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.rest_api.id
}

resource "aws_api_gateway_method_settings" "general_settings" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  stage_name  = aws_api_gateway_stage.stage.stage_name
  method_path = "*/*"

  settings {
    metrics_enabled = false
    logging_level   = "ERROR"
  }

  depends_on = [
    aws_api_gateway_deployment.stage,
    aws_api_gateway_stage.stage
  ]
}

# Relational Database Service (RDS)
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "mysql"
  engine_version       = "5.7"
  instance_class       = "db.t2.micro"
  name                 = "integer_saas_db"
  username             = var.rds_master_username
  password             = var.rds_master_password
  parameter_group_name = "default.mysql5.7"
  apply_immediately    = true
  publicly_accessible  = true
  vpc_security_group_ids    = [aws_security_group.rds.id]
  db_subnet_group_name      = aws_db_subnet_group.default.name
}

# RDS's subnet group
resource "aws_db_subnet_group" "default" {
  name        = "${var.application_name}-sn"
  description = "Subnet Group for ${var.application_name} database"
  subnet_ids  = data.aws_subnet_ids.default.ids
}


# API Gateway Resource

# Creates a proxy resource
resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "{proxy+}"
}


# API Gateway: ANY PROXY INTEGRATION
resource "aws_api_gateway_method" "proxy" {
  rest_api_id      = aws_api_gateway_rest_api.rest_api.id
  resource_id      = aws_api_gateway_resource.proxy.id
  http_method      = "ANY"
  api_key_required = false
  authorization    = "NONE"
}

resource "aws_api_gateway_integration" "proxy" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.proxy.id
  http_method             = aws_api_gateway_method.proxy.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.function.invoke_arn
}

# --------------- #
# Cloudwatch Logs #
# --------------- #

resource "aws_cloudwatch_log_group" "execution_log_group" {
  name              = "API-Gateway-Execution-Logs_${aws_api_gateway_rest_api.rest_api.id}/v1"
  retention_in_days = 1
}

resource "aws_cloudwatch_log_group" "access_log_group" {
  name              = "api-gateway/${var.rest_api_name}"
  retention_in_days = 1
}

resource "aws_cloudwatch_log_group" "function_log_group" {
  name              = "/aws/lambda/${var.lambda_function_name}"
  retention_in_days = 1
}