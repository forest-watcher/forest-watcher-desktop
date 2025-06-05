variable "project_name" {
  type        = string
}

variable "zone_id" {
  type        = string
}

variable "app_urls" {
  type        = list(string)
}

variable "repo_name" {
  type        = string
}


variable "aws_acm_certificate_arn" {
  type = string
}