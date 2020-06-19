import { Schema } from "../schema"
import { check_min_value } from "../validator/string/min_length"
import { check_max_value } from "../validator/string/max_length"
import { check_regex_pattern } from "../validator/string/regex_pattern"

export type Options = {
    min_length?: number
    max_length?: number
    regexp?: object
}
export function string(options: Options) {
    return new Schema<string>(options, [
        check_min_value,
        check_max_value,
        check_regex_pattern,
    ])
}