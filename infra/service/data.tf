# VPC, SUBNET AND SECURITY GROUPS
data "aws_vpc" "default" {
  filter {
    name   = "tag:Name"
    values = ["Default"]
  }
}

data "aws_subnet_ids" "default" {
  vpc_id = data.aws_vpc.default.id

  tags = {
    Tier = "Public"
  }
}

data "template_file" "assume_lambda_role" {
  template = file("${path.module}/templates/AssumeRole.json")

  vars = {
    service = "lambda.amazonaws.com"
  }
}

data "template_file" "aws_lambda_basic_execution_role_policy" {
  template = file("${path.module}/templates/AWSLambdaBasicExecutionRole.json")

  vars = {
    cloudwatch_log_arn = aws_cloudwatch_log_group.function_log_group.arn
  }
}

data "template_file" "aws_lambda_vpc_role_policy" {
  template = file("${path.module}/templates/AWSLambdaVPC.json")
}

data "template_file" "assume_apigateway_role" {
  template = file("${path.module}/templates/AssumeRole.json")

  vars = {
    service = "apigateway.amazonaws.com"
  }
}