terraform {
  backend "s3" {
    bucket = "forest-watcher-web-test.terraform"
    key    = "test/terraform.tfstate"
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
  project_name = "${local.client}-forest-watcher-web"
  environment  = "test"
  name         = "${local.project_name}-${local.environment}"
  domain       = "${local.environment}.gfw-web.3sidedcube.com"
  tags = {
    client      = local.client
    product     = local.project_name
    Environment = local.environment
  }
}


provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = local.tags
  }
}

module "domain" {
  source   = "../../modules/domain"
  hostname = local.domain
}


module "web" {
  source = "../../modules/web"

  project_name            = local.name
  app_urls                = [local.domain]
  zone_id                 = module.domain.hosted_zone_id
  repo_name               = "forest-watcher/forest-watcher-desktop"
  aws_acm_certificate_arn = module.domain.acm_certificate_arn
}

resource "aws_route53_record" "main" {
  zone_id = module.domain.hosted_zone_id
  name    = local.domain
  type    = "A"

  alias {
    name                   = module.web.cloudfront_distribution_domain_name
    zone_id                = module.web.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }
}