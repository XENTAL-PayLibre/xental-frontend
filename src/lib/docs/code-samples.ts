import { type ApiOperation } from './openapi';

export interface LanguageDef {
  id: string;
  label: string;
}

/** The top 8 languages shown per endpoint (order matters — cURL first, like Resend/Paystack). */
export const LANGUAGES: LanguageDef[] = [
  { id: 'curl', label: 'cURL' },
  { id: 'node', label: 'Node.js' },
  { id: 'python', label: 'Python' },
  { id: 'php', label: 'PHP' },
  { id: 'ruby', label: 'Ruby' },
  { id: 'go', label: 'Go' },
  { id: 'java', label: 'Java' },
  { id: 'csharp', label: 'C#' },
];

function fullUrl(op: ApiOperation, base: string): string {
  return `${base}${op.path.replace('{accountRef}', 'inv_001').replace(/\{(\w+)\}/g, ':$1')}`;
}

function jsonBody(op: ApiOperation): string | null {
  return op.requestExample ? JSON.stringify(op.requestExample, null, 2) : null;
}

const AUTH_HEADER = 'Authorization: Bearer <API_TOKEN>';

function curl(op: ApiOperation, base: string): string {
  const lines = [`curl -X ${op.method.toUpperCase()} "${fullUrl(op, base)}"`];
  if (op.requiresAuth) lines.push(`  -H "${AUTH_HEADER}"`);
  const body = jsonBody(op);
  if (body) {
    lines.push(`  -H "Content-Type: application/json"`);
    lines.push(`  -d '${body.replace(/\n/g, '\n  ')}'`);
  }
  return lines.join(' \\\n');
}

function node(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const headers: string[] = [];
  if (op.requiresAuth) headers.push(`    Authorization: \`Bearer \${apiToken}\``);
  if (body) headers.push(`    "Content-Type": "application/json"`);
  return [
    `const res = await fetch("${fullUrl(op, base)}", {`,
    `  method: "${op.method.toUpperCase()}",`,
    headers.length ? `  headers: {\n${headers.join(',\n')}\n  },` : null,
    body ? `  body: JSON.stringify(${body.replace(/\n/g, '\n  ')}),` : null,
    `});`,
    `const data = await res.json();`,
  ].filter(Boolean).join('\n');
}

function python(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const headers: string[] = [];
  if (op.requiresAuth) headers.push(`    "Authorization": f"Bearer {api_token}"`);
  if (body) headers.push(`    "Content-Type": "application/json"`);
  return [
    `import requests`,
    ``,
    `res = requests.${op.method}(`,
    `    "${fullUrl(op, base)}",`,
    headers.length ? `    headers={\n${headers.join(',\n')}\n    },` : null,
    body ? `    json=${body.replace(/: true/g, ': True').replace(/: false/g, ': False').replace(/\n/g, '\n    ')},` : null,
    `)`,
    `data = res.json()`,
  ].filter(Boolean).join('\n');
}

function phpArray(obj: Record<string, unknown>): string {
  const parts = Object.entries(obj).map(([k, v]) => `"${k}" => ${JSON.stringify(v)}`);
  return `[${parts.join(', ')}]`;
}

function php(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const headers = [`'Accept: application/json'`];
  if (op.requiresAuth) headers.push(`'Authorization: Bearer ' . $apiToken`);
  if (body) headers.push(`'Content-Type: application/json'`);
  return [
    `$ch = curl_init("${fullUrl(op, base)}");`,
    `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${op.method.toUpperCase()}");`,
    `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);`,
    `curl_setopt($ch, CURLOPT_HTTPHEADER, [${headers.join(', ')}]);`,
    body ? `curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${phpArray(op.requestExample!)}));` : null,
    `$data = json_decode(curl_exec($ch), true);`,
    `curl_close($ch);`,
  ].filter(Boolean).join('\n');
}

function ruby(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const headers = [`req["Accept"] = "application/json"`];
  if (op.requiresAuth) headers.push(`req["Authorization"] = "Bearer #{api_token}"`);
  if (body) headers.push(`req["Content-Type"] = "application/json"`);
  const klass = op.method.charAt(0).toUpperCase() + op.method.slice(1);
  return [
    `require "net/http"`,
    `require "json"`,
    ``,
    `uri = URI("${fullUrl(op, base)}")`,
    `req = Net::HTTP::${klass}.new(uri)`,
    ...headers,
    body ? `req.body = ${JSON.stringify(op.requestExample)}` : null,
    `res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }`,
    `data = JSON.parse(res.body)`,
  ].filter(Boolean).join('\n');
}

function go(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  return [
    `package main`,
    ``,
    `import (`,
    `\t"net/http"`,
    body ? `\t"strings"` : null,
    `)`,
    ``,
    `func main() {`,
    body ? `\tbody := strings.NewReader(\`${op.requestExample ? JSON.stringify(op.requestExample) : ''}\`)` : null,
    `\treq, _ := http.NewRequest("${op.method.toUpperCase()}", "${fullUrl(op, base)}", ${body ? 'body' : 'nil'})`,
    op.requiresAuth ? `\treq.Header.Set("Authorization", "Bearer "+apiToken)` : null,
    body ? `\treq.Header.Set("Content-Type", "application/json")` : null,
    `\tres, _ := http.DefaultClient.Do(req)`,
    `\tdefer res.Body.Close()`,
    `}`,
  ].filter(Boolean).join('\n');
}

function java(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const bodyPublisher = body
    ? `HttpRequest.BodyPublishers.ofString(${JSON.stringify(op.requestExample ? JSON.stringify(op.requestExample) : '')})`
    : `HttpRequest.BodyPublishers.noBody()`;
  return [
    `HttpClient client = HttpClient.newHttpClient();`,
    `HttpRequest request = HttpRequest.newBuilder()`,
    `    .uri(URI.create("${fullUrl(op, base)}"))`,
    `    .method("${op.method.toUpperCase()}", ${bodyPublisher})`,
    op.requiresAuth ? `    .header("Authorization", "Bearer " + apiToken)` : null,
    body ? `    .header("Content-Type", "application/json")` : null,
    `    .build();`,
    `HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());`,
  ].filter(Boolean).join('\n');
}

function csharp(op: ApiOperation, base: string): string {
  const body = jsonBody(op);
  const method = op.method.charAt(0).toUpperCase() + op.method.slice(1);
  return [
    `using var client = new HttpClient();`,
    op.requiresAuth
      ? `client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);`
      : null,
    body
      ? `var content = new StringContent(${JSON.stringify(op.requestExample ? JSON.stringify(op.requestExample) : '')}, Encoding.UTF8, "application/json");`
      : null,
    body
      ? `var res = await client.${method}Async("${fullUrl(op, base)}", content);`
      : `var res = await client.${method}Async("${fullUrl(op, base)}");`,
    `var data = await res.Content.ReadAsStringAsync();`,
  ].filter(Boolean).join('\n');
}

const GENERATORS: Record<string, (op: ApiOperation, base: string) => string> = {
  curl, node, python, php, ruby, go, java, csharp,
};

/** Raw code samples for every language at a given base URL. */
export function codeSamples(op: ApiOperation, base: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const lang of LANGUAGES) out[lang.id] = GENERATORS[lang.id](op, base);
  return out;
}
