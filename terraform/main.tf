terraform {
  backend s3 {
    bucket  = "doihavethebmlt-tfstate"
    key     = "doihavethebmlt.tfstate"
    region  = "us-east-1"
    profile = "bmlt-enabled"
  }
}

provider aws {
  region  = "us-east-1"
  profile = "bmlt-enabled"
}
