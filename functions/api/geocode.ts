// Cloudflare Pages Function: proxies /api/geocode to the BMLT geo-api,
// injecting the Bearer token server-side so the key never ships to the browser.
// Set GEO_API_KEY as a secret in the Cloudflare Pages project settings.

interface Env {
    GEO_API_KEY: string;
}

interface RequestContext {
    request: Request;
    env: Env;
}

const UPSTREAM = 'https://geo.aws.bmlt.app/api/geocode';

export async function onRequestGet(context: RequestContext): Promise<Response> {
    const { request, env } = context;

    if (!env.GEO_API_KEY) {
        return new Response(JSON.stringify({ error: 'GEO_API_KEY is not configured' }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    }

    const incoming = new URL(request.url);
    const upstream = new URL(UPSTREAM);
    incoming.searchParams.forEach((val, key) => upstream.searchParams.set(key, val));

    const upstreamResponse = await fetch(upstream.toString(), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${env.GEO_API_KEY}`,
            Accept: 'application/json'
        }
    });

    const headers: Record<string, string> = {
        'content-type': upstreamResponse.headers.get('content-type') ?? 'application/json'
    };
    const retryAfter = upstreamResponse.headers.get('retry-after');
    if (retryAfter) {
        headers['retry-after'] = retryAfter;
    }

    return new Response(upstreamResponse.body, {
        status: upstreamResponse.status,
        headers
    });
}
