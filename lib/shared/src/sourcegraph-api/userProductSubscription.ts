import { Observable, map } from 'observable-fns'
import { authStatus } from '../auth/authStatus'
import {
    firstValueFrom,
    storeLastValue,
} from '../misc/observable'
import {
    firstResultFromOperation,
    pendingOperation,
} from '../misc/observableOperation'
import { isDotCom } from './environments'

export interface UserProductSubscription {
    // TODO(sqs): this is the only field related to the user's subscription we were using previously
    // in AuthStatus, so start with just it and we can add more.

    /**
     * Whether the user is on Cody Free (i.e., can upgrade to Cody Pro). This is `false` for
     * enterprise users because they already have a higher degree of access than Cody Free/Pro.
     *
     * It's used to customize rate limit messages and show upgrade buttons in the UI.
     */
    userCanUpgrade: boolean
}

/**
 * For local development with Ollama only - always return null subscription
 * (treating all users as enterprise users with full access)
 */
export const userProductSubscription: Observable<
    UserProductSubscription | null | typeof pendingOperation
> = authStatus.pipe(
    map(() => null) // Always return null to bypass all subscription checks
)

const userProductSubscriptionStorage = storeLastValue(userProductSubscription)

/**
 * Get the current user's product subscription info. If authentication is pending, it awaits
 * successful authentication.
 */
export function currentUserProductSubscription(): Promise<UserProductSubscription | null> {
    return firstResultFromOperation(userProductSubscriptionStorage.observable)
}

/**
 * Check if the user is an enterprise user.
 */
export async function checkIfEnterpriseUser(): Promise<boolean> {
    const authStatusValue = await firstValueFrom(authStatus)
    return !isDotCom(authStatusValue)
}

/**
 * Get the current user's last-known product subscription info. Using this introduce a race
 * condition if auth is pending.
 */
export function cachedUserProductSubscription(): UserProductSubscription | null {
    const value = userProductSubscriptionStorage.value.last
    return value === pendingOperation || !value ? null : value
}
