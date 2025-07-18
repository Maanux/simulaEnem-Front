import { provideServerRendering } from '@angular/ssr';
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { appConfig } from './app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
