provider "aws" {
  alias   = "acm_provider"
  region  = "us-east-1"
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

resource "aws_route53_zone" "main" {
  name = var.hostname
}

resource "aws_acm_certificate" "main" {
  domain_name               = var.acm_certificate_primary_hostname != null ? var.acm_certificate_primary_hostname : aws_route53_zone.main.name
  validation_method         = "DNS"
  subject_alternative_names = var.acm_certificate_alternative_names
}

resource "aws_route53_record" "validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for record in aws_route53_record.validation : record.fqdn]
}