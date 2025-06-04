terraform {
  backend "s3" {
    bucket = "forest-watcher-staging.terraform"
    key    = "staging/terraform.tfstate"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.82.2"
    }
  }
}

locals {
  client       = "wri"
  project_name = "${local.client}-forest-watcher"
  environment  = "staging"
  name         = "${local.project_name}-${local.environment}"
  domain       = ""
  tags = {
    client      = local.client
    product     = local.project_name
    Environment = local.environment
  }
}


provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = local.tags
  }
}

module "domain" {
  source   = "git@github.com:3sidedcube/terraform-aws-domain.git?ref=v0.3.0"
  hostname = local.domain

  providers = {
    aws = aws.us_east_1
  }
}


module "web" {
  source = "../../modules/web"

  project_name = local.name
  app_url      = local.domain
  zone_id      = module.prod_domain.zone_id
  repo_name    = "forest-watcher/forest-watcher-desktop"
}
