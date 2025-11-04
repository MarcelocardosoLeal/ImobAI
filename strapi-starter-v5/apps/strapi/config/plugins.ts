export default ({ env }) => {
  const awsS3Config = prepareAwsS3Config(env)
  if (!awsS3Config) {
    console.info(
      "AWS S3 upload configuration is not complete. Local file storage will be used."
    )
  }

  return {
    upload: {
      config: awsS3Config ?? localUploadConfig,
    },

    seo: {
      enabled: true,
    },

    "config-sync": {
      enabled: true,
    },

    "users-permissions": {
      config: {
        jwt: {
          expiresIn: "30d", // this value is synced with NextAuth session maxAge
        },
      },
    },

    sentry: {
      enabled: true,
      config: {
        // Only set `dsn` property in production
        dsn: env("NODE_ENV") === "production" ? env("SENTRY_DSN") : null,
        sendMetadata: true,
      },
    },

    // email: {
    //   config: {
    //     provider: "mailgun",
    //     providerOptions: {
    //       key: env("MAILGUN_API_KEY"),
    //       domain: env("MAILGUN_DOMAIN"),
    //       url: env("MAILGUN_HOST", "https://api.eu.mailgun.net"),
    //     },
    //     settings: {
    //       defaultFrom: env("MAILGUN_EMAIL"),
    //       defaultReplyTo: env("MAILGUN_EMAIL"),
    //     },
    //   },
    // },
  }
}

const localUploadConfig: any = {
  // Local provider setup
  // https://docs.strapi.io/dev-docs/plugins/upload
  sizeLimit: 250 * 1024 * 1024, // 256mb in bytes,
}

const prepareAwsS3Config = (env) => {
  // Suporta ambos padrões de variáveis: do template original (AWS_ACCESS_SECRET, AWS_BUCKET)
  // e do stack antigo/MinIO (AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET, AWS_S3_ENDPOINT, AWS_S3_FORCE_PATH_STYLE)
  const awsAccessKeyId = env("AWS_ACCESS_KEY_ID")
  const awsAccessSecret = env("AWS_ACCESS_SECRET", env("AWS_SECRET_ACCESS_KEY"))
  const awsRegion = env("AWS_REGION")
  const awsBucket = env("AWS_BUCKET", env("AWS_S3_BUCKET"))
  const awsEndpoint = env("AWS_S3_ENDPOINT")
  const awsForcePathStyle = env.bool("AWS_S3_FORCE_PATH_STYLE", false)

  const required = [awsAccessKeyId, awsAccessSecret, awsRegion, awsBucket]
  const ok = required.every((v) => v != null && v !== "")

  if (!ok) return undefined

  const s3Options: any = {
    credentials: {
      accessKeyId: awsAccessKeyId,
      secretAccessKey: awsAccessSecret,
    },
    region: awsRegion,
    params: {
      ACL: env("AWS_ACL", "public-read"),
      signedUrlExpires: env("AWS_SIGNED_URL_EXPIRES", 15 * 60),
      Bucket: awsBucket,
    },
  }

  // Suporte a MinIO/S3 compatível
  if (awsEndpoint) {
    s3Options.endpoint = awsEndpoint
    s3Options.forcePathStyle = awsForcePathStyle
  }

  return {
    provider: "aws-s3",
    providerOptions: {
      baseUrl: env("CDN_URL"),
      rootPath: env("CDN_ROOT_PATH"),
      s3Options,
    },
    actionOptions: {
      upload: {},
      uploadStream: {},
      delete: {},
    },
  }
}
