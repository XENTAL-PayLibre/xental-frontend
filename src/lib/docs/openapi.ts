import spec from './openapi.json';

/** Live (production) API base shown in code samples. */
export const DOCS_API_BASE =
  process.env.NEXT_PUBLIC_DOCS_API_BASE?.replace(/\/$/, '') || 'https://api.xental.online';

/**
 * Sandbox API base — a separate host for test-mode integration (like Nomba's sandbox).
 * Defaults to the staging deployment, which already runs as our sandbox; point this at a
 * vanity host (e.g. https://sandbox.xental.online) once its DNS/cert are in place.
 */
export const DOCS_SANDBOX_BASE =
  process.env.NEXT_PUBLIC_DOCS_SANDBOX_BASE?.replace(/\/$/, '') || 'https://api.staging.xental.online';

export const DOCS_ENVIRONMENTS = [
  { id: 'live', label: 'Live', base: DOCS_API_BASE },
  { id: 'sandbox', label: 'Sandbox', base: DOCS_SANDBOX_BASE },
] as const;

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
const METHODS: HttpMethod[] = ['get', 'post', 'put', 'patch', 'delete'];

/** Admin plane is internal — never surfaced in the public docs. */
const ADMIN_TAGS = new Set(['AdminAuth', 'AdminManagement', 'AdminOnboarding', 'AdminReconciliation']);
const isAdminPath = (p: string) => p.includes('/admin');

export interface PropertyField {
  name: string;
  type: string;
  required: boolean;
  nullable: boolean;
  description?: string;
  enum?: string[];
}

export interface OperationParam {
  name: string;
  location: string; // path | query | header
  required: boolean;
  type: string;
  description?: string;
}

export interface ApiResponse {
  status: string;
  description?: string;
}

export interface ApiOperation {
  id: string;
  method: HttpMethod;
  path: string;
  tag: string;
  summary: string;
  description?: string;
  params: OperationParam[];
  requestFields: PropertyField[];
  requestExample: Record<string, unknown> | null;
  responses: ApiResponse[];
  requiresAuth: boolean;
}

type AnySchema = Record<string, any>;

function resolveRef(ref: string): AnySchema | null {
  const name = ref.replace('#/components/schemas/', '');
  return (spec as AnySchema).components?.schemas?.[name] ?? null;
}

function schemaOf(node: AnySchema | null | undefined): AnySchema | null {
  if (!node) return null;
  if (node.$ref) return resolveRef(node.$ref);
  return node;
}

function typeLabel(node: AnySchema): string {
  if (!node) return 'string';
  if (node.$ref) return node.$ref.replace('#/components/schemas/', '');
  if (node.enum) return 'enum';
  if (node.type === 'array') return `${typeLabel(node.items ?? {})}[]`;
  if (node.format === 'int64' || node.format === 'int32') return 'integer';
  if (node.format === 'date-time') return 'string<date-time>';
  return node.type ?? 'string';
}

function fieldsFromSchema(schema: AnySchema | null | undefined): PropertyField[] {
  const resolved = schemaOf(schema);
  if (!resolved?.properties) return [];
  const required: string[] = resolved.required ?? [];
  return Object.entries<AnySchema>(resolved.properties).map(([name, p]) => ({
    name,
    type: typeLabel(p),
    required: required.includes(name) || p.nullable === false,
    nullable: p.nullable === true,
    description: p.description,
    enum: p.enum,
  }));
}

/** A realistic-looking example value, keyed by field name then type. */
function exampleValue(name: string, node: AnySchema): unknown {
  const n = name.toLowerCase();
  if (node.enum) return node.enum[0];
  if (n.includes('email')) return 'ada@example.com';
  if (n === 'password') return 'Str0ng-Passw0rd!';
  if (n.includes('accountref') || n === 'ref') return 'inv_001';
  if (n.includes('accountnumber')) return '0123456789';
  if (n.includes('bankcode')) return '011';
  if (n.includes('kobo')) return 500000;
  if (n.includes('bps')) return 8000;
  if (n === 'priority') return 0;
  if (n === 'trigger') return 'Overpaid';
  if (n === 'action') return 'Hold';
  if (n === 'basis') return 'Percentage';
  if (n === 'mode') return 'test';
  if (n === 'label') return 'server-prod';
  if (n.includes('name')) return 'Ada Lovelace';

  switch (typeLabel(node)) {
    case 'integer': return 100000;
    case 'boolean': return false;
    case 'string<date-time>': return '2026-01-01T00:00:00Z';
    default:
      if (typeLabel(node).endsWith('[]')) return [];
      return 'string';
  }
}

function exampleFromSchema(schema: AnySchema | null | undefined): Record<string, unknown> | null {
  const resolved = schemaOf(schema);
  if (!resolved?.properties) return null;
  const out: Record<string, unknown> = {};
  for (const [name, p] of Object.entries<AnySchema>(resolved.properties)) {
    if (p.nullable === true && !['accountRef', 'email', 'name'].includes(name)) continue;
    out[name] = exampleValue(name, p);
  }
  return Object.keys(out).length ? out : null;
}

const RESPONSE_TEXT: Record<string, string> = {
  '200': 'OK', '201': 'Created', '202': 'Accepted', '204': 'No Content',
  '400': 'Bad Request', '401': 'Unauthorized', '403': 'Forbidden',
  '404': 'Not Found', '409': 'Conflict',
};

function requestSchemaNode(op: AnySchema): AnySchema | undefined {
  return op.requestBody?.content?.['application/json']?.schema;
}

let cache: ApiOperation[] | null = null;

/** All developer-facing operations (admin excluded), flattened. */
export function getOperations(): ApiOperation[] {
  if (cache) return cache;
  const ops: ApiOperation[] = [];
  for (const [path, item] of Object.entries<AnySchema>((spec as AnySchema).paths)) {
    if (isAdminPath(path)) continue;
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      const tag: string = op.tags?.[0] ?? 'General';
      if (ADMIN_TAGS.has(tag)) continue;

      const params: OperationParam[] = (op.parameters ?? []).map((p: AnySchema) => ({
        name: p.name,
        location: p.in,
        required: !!p.required,
        type: typeLabel(p.schema ?? {}),
        description: p.description,
      }));
      const reqNode = requestSchemaNode(op);
      ops.push({
        id: (op.operationId || `${method}-${path}`).replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase(),
        method,
        path,
        tag,
        summary: op.summary ?? `${method.toUpperCase()} ${path}`,
        description: op.description,
        params,
        requestFields: fieldsFromSchema(reqNode),
        requestExample: exampleFromSchema(reqNode),
        responses: Object.keys(op.responses ?? {}).map((status) => ({
          status,
          description: op.responses[status]?.description || RESPONSE_TEXT[status],
        })),
        // Anonymous endpoints live under Auth/OAuth/Health/Webhooks/AgentDiscovery + checkout GETs.
        requiresAuth: !['Auth', 'OAuth', 'Health', 'AgentDiscovery', 'Webhooks'].includes(tag)
          && !(tag === 'Checkout' && method === 'get'),
      });
    }
  }
  cache = ops;
  return ops;
}

export function getOperationsByTag(tag: string): ApiOperation[] {
  return getOperations().filter((o) => o.tag === tag);
}

export function getApiInfo() {
  const s = spec as AnySchema;
  return { title: s.info?.title ?? 'Xental API', version: s.info?.version ?? 'v1' };
}
