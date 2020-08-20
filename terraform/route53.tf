resource aws_route53_zone domain {
  name = "doihavethebmlt.org"
}

resource aws_route53_record cdn_cname_naked {
  zone_id = aws_route53_zone.domain.id
  name    = aws_route53_zone.domain.name
  type    = "A"
  ttl     = 300
  records = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]
}

resource aws_route53_record cdn_cname_www {
  zone_id = aws_route53_zone.domain.id
  name    = "www.${aws_route53_zone.domain.name}"
  type    = "A"
  ttl     = 300
  records = [
    "185.199.108.153",
    "185.199.109.153",
    "185.199.110.153",
    "185.199.111.153",
  ]
}
