output "iam_role_arn" {
  value = aws_iam_role.ci.arn
}

output "cloudfront_distribution_domain_name" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_distribution_hosted_zone_id" {
  value = aws_cloudfront_distribution.main.hosted_zone_id
}