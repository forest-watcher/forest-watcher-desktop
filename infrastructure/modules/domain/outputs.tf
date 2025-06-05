output "acm_certificate_arn" {
  value = aws_acm_certificate.main.arn
}

output "hosted_zone_id" {
  value = aws_route53_zone.main.id
}

output "hosted_zone_name" {
  value = aws_route53_zone.main.name
}

output "name_servers" {
  value = aws_route53_zone.main.name_servers
}