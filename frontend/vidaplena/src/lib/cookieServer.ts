import { cookies } from 'next/headers';

export async function getCookieServer() {

    const cookiesStorage = await cookies();

    const token = cookiesStorage.get('session')?.value;

    return token || null;
}