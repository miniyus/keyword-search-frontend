import { auth, date } from 'helpers';
import { api } from 'api';

const authCheck = (store: any) => (next: any) => (action: any) => {
  const token = auth.getToken()?.accessToken;

  if (token?.token) {
    let isValid = false;
    console.debug('hi');
    const tokenInfo = auth.tokenInfo(
      auth.getToken()?.accessToken.token as string,
    );

    if (tokenInfo) {
      const expAt = date.unix(tokenInfo.exp);
      const now = date(new Date());
      const expTime = date.duration(expAt.diff(now));

      if (expTime.asSeconds() > 0) {
        isValid = true;
      }
    }

    if (!isValid) {
      api()
        .withToken(auth.getToken()?.accessToken.token as string, 'bearer')
        .get('api/auth/me')
        .then((res) => {
          if (res.isSuccess) {
            console.log('access_token is alive');
            return;
          }

          if (res.res && res.res.status == 401) {
            // refresh
            console.log('need refresh');
          }

          auth.logout();
          window.location.href = '/login';
        })
        .catch((reason) => {
          console.log('need refresh', reason);
          auth.logout();
          window.location.href = '/login';
        });
    }
  }

  next(action);
};

export default authCheck;
