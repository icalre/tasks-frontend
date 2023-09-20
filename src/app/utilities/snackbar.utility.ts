import {MatSnackBar} from '@angular/material/snack-bar';

export const showSnackbar = (
    snackbar: MatSnackBar,
    message: string,
    duration: number = 3000
) => {
    snackbar.open(message, 'Close', {
        duration,
    });
};

export const showErrorSnackbar = (
    snackbar: MatSnackBar,
    errorMessage?: string,
    duration: number = 3000
) => {
    snackbar.open(errorMessage || 'An error occurred.', 'Close', {
        duration,
    });
};
