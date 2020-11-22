variable "application_name" {
  type        = string
  description = "(Optional) The application name"
  default     = "integer-saas"
}

variable "rest_api_name" {
  type        = string
  description = "(Required) The API Gateway name"
  default = "integer-saas"
}

variable "lambda_s3_deployment_bucket" {
  type        = string
  description = "(Required) S3 bucket used for deployments"
  default = "prod-integer-saas-state"
}

variable "rds_app_username" {
  type        = string
  description = "(Required) RDS app username"
}

variable "rds_app_password" {
  type        = string
  description = "(Required) RDS app password"
}

variable "rds_master_username" {
  type        = string
  description = "(Required) RDS master username"
}

variable "rds_master_password" {
  type        = string
  description = "(Required) RDS master password"
}

variable "lambda_function_name" {
  type        = string
  description = "(Required) The name given to the lambda function"
  default     = "integer-saas-lambda"
}

variable "lambda_zip_s3_bucket" {
  type        = string
  description = "(Optional) The S3 Bucket name where the deployment package is located"
  default     = ""
}

variable "lambda_zip_s3_key" {
  type        = string
  description = "(Optional) The name of the deployment package in the S3 Bucket"
  default     = ""
}

