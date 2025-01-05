import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {jwtInterceptor} from "./app/core/interceptors/jwt.interceptor";
 // Adjust this path as needed

// Let's create an enhanced configuration that includes our HTTP interceptor
const enhancedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers || [], // Keep existing providers if any
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
};

// Bootstrap the application with our enhanced configuration
bootstrapApplication(AppComponent, enhancedConfig)
  .catch((err) => console.error(err));
