variable "application_name" {
  type        = string
  description = "(Required) Application name, used to define bucket"
}

variable "env" {
  type        = string
  description = "(Required) Deployment environment [prod, dev, stg]"
}
