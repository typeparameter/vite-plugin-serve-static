import http from "http";

export type ResolveFn = (match: RegExpExecArray) => string;

type RuleConfig = {
  readonly pattern: RegExp;
  readonly resolve: string | ResolveFn;
  readonly headers?: http.OutgoingHttpHeaders;
};

export type Config =
  | RuleConfig[]
  | {
      readonly rules: RuleConfig[];
      readonly contentType?: string;
    };

export function normalizeConfig(config: Config) {
  const { rules, ...rest } = Array.isArray(config) ? { rules: config } : config;

  const normalizedRules = rules.map((rule) => ({
    ...rule,
    headers: normalizeHeaders(rule.headers),
  }));

  return { rules: normalizedRules, ...rest };
}

function normalizeHeaders(headers?: http.OutgoingHttpHeaders): http.OutgoingHttpHeaders {
  if (!headers) return {};

  const entries = Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]);
  return Object.fromEntries(entries);
}
