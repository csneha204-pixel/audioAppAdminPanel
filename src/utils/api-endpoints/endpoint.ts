export const URLS = {
  user: {
    signInUser: "auth/login",
    logoutUser: "auth/logout",
    resetPassword: "auth/reset-password",
    forgotPassword: "auth/forgot-password",
    verifyOtp: "auth/verify-otp",
    refreshToken: "auth/refresh",
    getUserDetails: "user/me",
  },
  file: {
    series: "file/series",
    seriesById: (id: string) => `file/series/${id}`,
    seasonsBySeries: (seriesId: string) => `file/series/${seriesId}/seasons`,
    episodesBySeason: (seriesId: string, seasonId: string) =>
      `file/series/${seriesId}/seasons/${seasonId}/episodes`,
    languages: "file/languages",
    carousels: "file/carousels",
    carouselById: (id: string) => `file/carousels/${id}`,
  }
};
