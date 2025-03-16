type FormState = {
    message: string;
    success: boolean;
    redirectUrl?: string;
  };
  
  const INITIAL_FORM_STATE: FormState = {
    message: "",
    success: false,
  };
  
  export {INITIAL_FORM_STATE, type FormState};