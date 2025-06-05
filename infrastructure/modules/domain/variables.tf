variable "hostname" {
  type        = string
}

variable "acm_certificate_alternative_names" {
  type        = list(string)
  default     = []
}

variable "acm_certificate_primary_hostname" {
  type        = string
  default     = null
}