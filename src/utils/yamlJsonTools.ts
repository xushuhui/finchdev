import yaml from 'js-yaml'

interface StringResult {
  output: string
  error: string
}

function success(output: string): StringResult {
  return { output, error: '' }
}

function failure(error: string): StringResult {
  return { output: '', error }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function yamlToJson(input: string): StringResult {
  try {
    const parsed = yaml.load(input) as unknown
    return success(JSON.stringify(parsed, null, 2))
  } catch (error) {
    return failure(`Invalid YAML: ${getErrorMessage(error)}`)
  }
}

export function jsonToYaml(input: string): StringResult {
  try {
    const parsed = JSON.parse(input) as unknown
    return success(yaml.dump(parsed, { noRefs: true }).trim())
  } catch (error) {
    return failure(`Invalid JSON: ${getErrorMessage(error)}`)
  }
}
