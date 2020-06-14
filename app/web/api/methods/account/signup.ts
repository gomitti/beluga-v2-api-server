import { MethodMetadata } from "../../metadata"
import { ContentTypes } from "../../facts/content_type"
import { AuthenticationTypes } from "../../facts/authentication_type"
import { RateLimits } from "../../facts/rate_limit"
import { HttpMethods } from "../../facts/http_method"
import { TokenTypes } from "../../facts/token_type"
import { Scopes } from "../../facts/scope"
import { MethodIdentifiers } from "../../identifiers"

export const metadata: MethodMetadata = {
    url: MethodIdentifiers.CreateAccount,
    http_method: HttpMethods.POST,
    rate_limiting: {
        [TokenTypes.System]: RateLimits.InternalSystem,
    },
    accepted_content_types: [
        ContentTypes.ApplicationFormUrlencoded,
        ContentTypes.ApplicationJson,
    ],
    accepted_authentication_types: [
        AuthenticationTypes.Cookie,
        AuthenticationTypes.AccessToken,
    ],
    accepted_scopes: [
        {
            token_type: TokenTypes.System,
            scope: Scopes.WriteApp,
        },
    ],
    description: ["新規アカウントを作成します"],
}
