const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN!;

if (!DOMAIN) {
  throw new Error("NEXT_PUBLIC_DOMAIN is not set");
}

const config = {
  DOMAIN,
};

export {config};
