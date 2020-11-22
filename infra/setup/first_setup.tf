terraform {
  required_version = "~> 0.13.2"
}

provider "aws" {
  version = "~> 2.0"
  region  = "us-east-1"
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.env}-${var.application_name}-state"
  acl    = "private"

  versioning {
    enabled = true
  }

  lifecycle {
    prevent_destroy = false
  }
}

resource "aws_s3_bucket_public_access_block" "block_tfstate_access" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
