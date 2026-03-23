import yaml from 'js-yaml'

function success(output) {
  return { output, error: '' }
}

function failure(error) {
  return { output: '', error }
}

export function yamlToJson(input) {
  try {
    const parsed = yaml.load(input)
    return success(JSON.stringify(parsed, null, 2))
  } catch (error) {
    return failure(`Invalid YAML: ${error.message}`)
  }
}

export function jsonToYaml(input) {
  try {
    const parsed = JSON.parse(input)
    return success(yaml.dump(parsed, { noRefs: true }).trim())
  } catch (error) {
    return failure(`Invalid JSON: ${error.message}`)
  }
}
