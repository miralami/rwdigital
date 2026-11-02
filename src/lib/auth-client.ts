import { createAuthClient } from 'better-auth/svelte';
import { adminClient } from 'better-auth/client/plugins';
import { ac } from '$lib/permissions';

export const authClient = createAuthClient({
  plugins: [adminClient({ ac })]
});

export const { signIn, signOut, signUp, useSession } = authClient;
