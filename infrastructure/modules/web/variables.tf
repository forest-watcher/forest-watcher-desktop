variable "project_name" {
  type        = string
  description = "Project name and environment name, used to prefix resources"
}

variable "zone_id" {
  type        = string
  description = "Route53 DNS Zone ID"
}

variable "app_url" {
  type        = string
  description = "App URL"
}

variable "repo_name" {
  type        = string
  description = "GitHub Repo Name"
}
