import { user_name } from "../../../app/validation"
import { ValueSchemaValidationError } from "../../../app/validation/error"

describe("user_name", () => {
    test("user_name", () => {
        const schema = user_name()
        expect(() => {
            schema.check("")
        }).toThrow(ValueSchemaValidationError)
        expect(() => {
            schema.check("*")
        }).toThrow(ValueSchemaValidationError)
        expect(() => {
            schema.check(
                "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
            )
        }).toThrow(ValueSchemaValidationError)
        expect(schema.check("beluga")).toBeUndefined()
    })
})
