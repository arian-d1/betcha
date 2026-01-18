declare global {
  interface Window {
    google: any;
  }
}

// export function initGoogleLogin(
//   clientId: string,
//   callback: (response: any) => void,
// ) {
//   window.google.accounts.id.initialize({
//     client_id: clientId,
//     callback,
//     use_fedcm_for_prompt: false
//   });
// }

// export function promptGoogleLogin() {
//   window.google.accounts.id.prompt();
// }
