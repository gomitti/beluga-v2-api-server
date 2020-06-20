import { ContentTypes } from "../../facts/content_type"
import { HttpMethods } from "../../facts/http_method"
import { MethodIdentifiers } from "../../identifier"
import {
    MethodFacts,
    define_method,
    define_arguments,
    define_expected_errors,
    ExpectedError,
} from "../../define"
import * as vs from "../../../../validation"
import {
    InternalErrorSpec,
    UnexpectedErrorSpec,
    WebApiRuntimeError,
} from "../../error"
import {
    signup,
    ErrorCodes as ModelErrorCodes,
} from "../../../../model/user/signup"
import { ModelRuntimeError } from "../../../../model/error"

export const argument_specs = define_arguments(
    ["name", "password", "confirmed_password"] as const,
    {
        name: {
            description: ["ユーザー名"],
            examples: ["beluga"],
            required: true,
            schema: vs.user_name(),
        },
        password: {
            description: ["パスワード"],
            examples: null,
            required: true,
            schema: vs.password(),
        },
        confirmed_password: {
            description: ["確認用のパスワード"],
            examples: null,
            required: true,
            schema: vs.password(),
        },
    }
)

export const expected_error_specs = define_expected_errors(
    [
        "invalid_arg_name",
        "invalid_arg_password",
        "invalid_arg_confirmed_password",
        "name_taken",
        "internal_error",
        "unexpected_error",
    ] as const,
    argument_specs,
    {
        invalid_arg_name: {
            description: ["ユーザー名が基準を満たしていません"],
            argument: "name",
        },
        invalid_arg_password: {
            description: ["パスワードが基準を満たしていません"],
            argument: "password",
        },
        invalid_arg_confirmed_password: {
            description: ["確認用のパスワードが一致しません"],
            hint: ["パスワードと確認用パスワードは同じものを入力してください"],
            argument: "confirmed_password",
        },
        name_taken: {
            description: [
                "このユーザー名はすでに取得されているため、新規作成できません",
            ],
            hint: ["別のユーザー名でアカウントを作成してください"],
        },
        internal_error: new InternalErrorSpec(),
        unexpected_error: new UnexpectedErrorSpec(),
    }
)

export const facts: MethodFacts = {
    url: MethodIdentifiers.CreateAccount,
    http_method: HttpMethods.POST,
    rate_limiting: {},
    accepted_content_types: [
        ContentTypes.ApplicationFormUrlEncoded,
        ContentTypes.ApplicationJson,
    ],
    authentication_required: false,
    accepted_authentication_methods: [],
    accepted_scopes: [],
    description: ["新規アカウントを作成します"],
}

function raise<T>(spec: ExpectedError<T>, source_error: Error) {
    throw new WebApiRuntimeError(spec, source_error.message)
}

export default define_method(
    facts,
    argument_specs,
    expected_error_specs,
    async (args, errors) => {
        if (args.password !== args.confirmed_password) {
            throw new WebApiRuntimeError(errors.invalid_arg_confirmed_password)
        }
        try {
            const user = await signup(args.name, args.password)
            console.log(user)
        } catch (error) {
            if (error instanceof ModelRuntimeError) {
                if (error.code === ModelErrorCodes.NameTaken) {
                    raise(errors.name_taken, error)
                } else {
                    raise(errors.internal_error, error)
                }
            } else {
                raise(errors.unexpected_error, error)
            }
        }
    }
)
