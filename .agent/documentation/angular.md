# Angular Framework

Angular is a comprehensive development platform for building mobile and desktop web applications using TypeScript and JavaScript. It provides a complete solution for modern web development with powerful tools for building scalable, maintainable applications. The framework is built around a component-based architecture with strong TypeScript support and comprehensive tooling.

Angular offers both traditional NgModule-based and modern standalone component architectures. The framework includes reactive programming support through RxJS and signals, a powerful dependency injection system, comprehensive form handling, routing capabilities, HTTP client functionality, and animation support. Angular 19+ introduces signal-based reactivity as a modern alternative to zone-based change detection, providing better performance and developer experience.

## Core Decorators and Components

### @Component - Define Components

Creates a reusable component with template, styles, and behavior encapsulation.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>{{ userName }}</h2>
      <p>Email: {{ userEmail }}</p>
      <button (click)="sendMessage()">Send Message</button>
    </div>
  `,
  styles: [`
    .card {
      border: 1px solid #ddd;
      padding: 16px;
      border-radius: 8px;
    }
  `]
})
export class UserCardComponent {
  userName = 'John Doe';
  userEmail = 'john@example.com';

  sendMessage() {
    console.log(`Sending message to ${this.userEmail}`);
  }
}
```

### @Injectable - Dependency Injection

Creates injectable services that can be provided at root, module, or component level.

```typescript
import { Injectable, InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Service with root-level injection
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string) {
    return this.http.get(`/api/users/${id}`);
  }
}

// InjectionToken for configuration
const API_BASE_URL = new InjectionToken<string>('API Base URL', {
  providedIn: 'root',
  factory: () => 'https://api.example.com'
});

// Service using InjectionToken
@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = inject(API_BASE_URL);
  private http = inject(HttpClient);

  get<T>(endpoint: string) {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }
}
```

### @Directive - Custom Directives

Creates reusable behaviors that can be attached to DOM elements.

```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';
  @Input() defaultColor = 'transparent';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(this.defaultColor);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}

// Usage in template:
// <p appHighlight="lightblue" defaultColor="white">Hover over me!</p>
```

## Signal-Based Reactivity

### signal() - Writable Signals

Creates reactive state values that automatically track dependencies and trigger updates.

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">Increment</button>
      <button (click)="decrement()">Decrement</button>
      <button (click)="reset()">Reset</button>
    </div>
  `
})
export class CounterComponent {
  // Writable signal
  count = signal(0);

  // Computed signal (automatically updates)
  doubleCount = computed(() => this.count() * 2);

  // Effect (runs when dependencies change)
  logEffect = effect(() => {
    console.log(`Count changed to: ${this.count()}`);
  });

  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.update(n => n - 1);
  }

  reset() {
    this.count.set(0);
  }
}
```

### input() - Signal-Based Inputs

Modern alternative to @Input decorator with automatic signal-based reactivity.

```typescript
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div>
      <h2>{{ displayName() }}</h2>
      <p>Age: {{ age() }}</p>
      <p *ngIf="isAdult()">Status: Adult</p>
    </div>
  `
})
export class UserProfileComponent {
  // Required input
  firstName = input.required<string>();
  lastName = input.required<string>();

  // Optional input with default
  age = input<number>(0);

  // Input with transform
  email = input('', {
    transform: (value: string) => value.toLowerCase().trim()
  });

  // Computed from inputs
  displayName = computed(() =>
    `${this.firstName()} ${this.lastName()}`
  );

  isAdult = computed(() => this.age() >= 18);
}

// Usage:
// <app-user-profile
//   firstName="John"
//   lastName="Doe"
//   [age]="25"
//   email="JOHN@EXAMPLE.COM">
// </app-user-profile>
```

### model() - Two-Way Binding with Signals

Creates a signal that supports two-way data binding.

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-text-input',
  standalone: true,
  template: `
    <input
      [value]="value()"
      (input)="value.set($event.target.value)"
      [placeholder]="placeholder()">
  `
})
export class TextInputComponent {
  value = model<string>('');
  placeholder = input<string>('Enter text...');
}

// Parent component
@Component({
  selector: 'app-parent',
  standalone: true,
  imports: [TextInputComponent],
  template: `
    <app-text-input [(value)]="searchText"></app-text-input>
    <p>You typed: {{ searchText() }}</p>
  `
})
export class ParentComponent {
  searchText = signal('');
}
```

## Reactive Forms

### FormControl, FormGroup, FormArray

Build type-safe reactive forms with validation and state management.

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserForm {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  hobbies: string[];
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <div>
        <input formControlName="firstName" placeholder="First Name">
        <div *ngIf="userForm.get('firstName')?.invalid && userForm.get('firstName')?.touched">
          <span *ngIf="userForm.get('firstName')?.errors?.['required']">
            First name is required
          </span>
          <span *ngIf="userForm.get('firstName')?.errors?.['minlength']">
            Minimum 2 characters required
          </span>
        </div>
      </div>

      <div>
        <input formControlName="email" placeholder="Email">
        <span *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
          Valid email required
        </span>
      </div>

      <div>
        <input type="number" formControlName="age" placeholder="Age">
        <span *ngIf="userForm.get('age')?.errors?.['min']">
          Must be at least 18
        </span>
      </div>

      <div formGroupName="address">
        <input formControlName="street" placeholder="Street">
        <input formControlName="city" placeholder="City">
        <input formControlName="zipCode" placeholder="Zip Code">
      </div>

      <div formArrayName="hobbies">
        <div *ngFor="let hobby of hobbiesArray.controls; let i = index">
          <input [formControlName]="i" placeholder="Hobby">
          <button type="button" (click)="removeHobby(i)">Remove</button>
        </div>
        <button type="button" (click)="addHobby()">Add Hobby</button>
      </div>

      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>

    <pre>{{ userForm.value | json }}</pre>
    <p>Valid: {{ userForm.valid }}</p>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  userForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    age: [0, [Validators.required, Validators.min(18), Validators.max(120)]],
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]]
    }),
    hobbies: this.fb.array<string>([])
  });

  get hobbiesArray() {
    return this.userForm.get('hobbies') as FormArray;
  }

  addHobby() {
    this.hobbiesArray.push(this.fb.control(''));
  }

  removeHobby(index: number) {
    this.hobbiesArray.removeAt(index);
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value as Partial<UserForm>;
      console.log('Form submitted:', formValue);
    }
  }
}
```

### Custom Validators

Create reusable validation logic for forms.

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, delay, map } from 'rxjs';

// Synchronous validator
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Password match validator
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  };
}

// Async validator (e.g., check username availability)
export function uniqueUsernameValidator(userService: any): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return userService.checkUsername(control.value).pipe(
      delay(500),
      map((isTaken: boolean) => isTaken ? { usernameTaken: true } : null)
    );
  };
}

// Usage in form
@Component({
  selector: 'app-registration',
  template: `...`
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  registrationForm = this.fb.group({
    username: ['',
      [Validators.required, forbiddenNameValidator(/admin/i)],
      [uniqueUsernameValidator(this.userService)]
    ],
    passwordGroup: this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator() })
  });
}
```

## HTTP Client

### HttpClient - Make HTTP Requests

Perform HTTP operations with automatic JSON parsing, error handling, and interceptors.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, retry, map, tap } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.example.com';

  // GET request with query parameters
  getUsers(page: number = 1, limit: number = 10): Observable<User[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', 'name');

    return this.http.get<ApiResponse<User[]>>(`${this.apiUrl}/users`, { params })
      .pipe(
        map(response => response.data),
        retry(3),
        catchError(this.handleError)
      );
  }

  // GET single user
  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`)
      .pipe(
        tap(user => console.log('Fetched user:', user)),
        catchError(this.handleError)
      );
  }

  // POST request
  createUser(user: Omit<User, 'id'>): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer token123'
    });

    return this.http.post<User>(`${this.apiUrl}/users`, user, { headers })
      .pipe(catchError(this.handleError));
  }

  // PUT request
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user)
      .pipe(catchError(this.handleError));
  }

  // PATCH request
  patchUser(id: number, changes: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${id}`, changes)
      .pipe(catchError(this.handleError));
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Download file with progress
  downloadFile(fileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/files/${fileId}`, {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        // Handle progress event
        return event as any;
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

// Component using the service
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error" class="error">{{ error }}</div>

    <ul *ngIf="users.length > 0">
      <li *ngFor="let user of users">
        {{ user.name }} ({{ user.email }})
        <button (click)="editUser(user)">Edit</button>
        <button (click)="deleteUser(user.id)">Delete</button>
      </li>
    </ul>

    <button (click)="loadUsers()">Refresh</button>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserApiService);

  users: User[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = null;

    this.userService.getUsers(1, 20).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
      },
      error: (err) => this.error = err.message
    });
  }

  editUser(user: User) {
    const updated = { ...user, name: user.name + ' (Updated)' };
    this.userService.updateUser(user.id, updated).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      }
    });
  }
}
```

### HTTP Interceptors

Intercept and modify HTTP requests and responses globally.

```typescript
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';

// Logging interceptor
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const startTime = Date.now();
  console.log(`Request started: ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(event => {
      if (event.type === 4) { // HttpEventType.Response
        const elapsed = Date.now() - startTime;
        console.log(`Request completed in ${elapsed}ms`);
      }
    }),
    catchError(error => {
      console.error('Request failed:', error);
      return throwError(() => error);
    })
  );
};

// Auth token interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('auth_token');

  if (authToken && !req.url.includes('/auth/')) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  return next(req);
};

// Error handling interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to login
        console.log('Unauthorized - redirecting to login');
      } else if (error.status === 403) {
        console.log('Forbidden - insufficient permissions');
      } else if (error.status === 500) {
        console.log('Server error - please try again later');
      }

      return throwError(() => error);
    })
  );
};

// Caching interceptor
const cache = new Map<string, any>();

export const cachingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    return of(cachedResponse);
  }

  return next(req).pipe(
    tap(event => {
      if (event.type === 4) {
        cache.set(req.url, event);
      }
    })
  );
};

// Application configuration with interceptors
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        loggingInterceptor,
        authInterceptor,
        errorInterceptor,
        cachingInterceptor
      ]),
      withFetch()
    )
  ]
};
```

## Routing

### Router Configuration

Define application routes with guards, resolvers, and lazy loading.

```typescript
import { Routes, provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, ResolveFn } from '@angular/router';

// Route guards
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};

export const unsavedChangesGuard: CanDeactivateFn<any> = (component) => {
  if (component.hasUnsavedChanges && component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};

// Resolver
interface User {
  id: string;
  name: string;
}

export const userResolver: ResolveFn<User> = (route, state) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id')!;
  return userService.getUser(userId);
};

// Route configuration
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/settings.component').then(m => m.SettingsComponent),
        canDeactivate: [unsavedChangesGuard]
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
  },
  {
    path: 'users/:id',
    loadComponent: () => import('./users/user-detail.component').then(m => m.UserDetailComponent),
    resolve: { user: userResolver }
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

// Bootstrap with router
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(), // Bind route params to component inputs
      withViewTransitions() // Enable view transitions API
    )
  ]
};
```

### Router Navigation and ActivatedRoute

Navigate programmatically and access route parameters.

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="user">
      <h2>{{ user.name }}</h2>
      <p>User ID: {{ userId }}</p>
      <p>Query Param: {{ searchQuery }}</p>

      <button (click)="goBack()">Back</button>
      <button (click)="goToEdit()">Edit</button>
      <button (click)="goToList()">User List</button>
    </div>
  `
})
export class UserDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  userId: string | null = null;
  searchQuery: string | null = null;
  user: any = null;

  ngOnInit() {
    // Get route parameters
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      console.log('User ID:', this.userId);
    });

    // Get query parameters
    this.route.queryParamMap.subscribe(queryParams => {
      this.searchQuery = queryParams.get('search');
    });

    // Get resolved data
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });

    // Alternative: snapshot (for non-changing params)
    // this.userId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    // Navigate back in history
    window.history.back();
  }

  goToEdit() {
    // Relative navigation
    this.router.navigate(['edit'], {
      relativeTo: this.route,
      queryParams: { mode: 'advanced' }
    });
  }

  goToList() {
    // Absolute navigation with extras
    const navigationExtras: NavigationExtras = {
      queryParams: { page: 1 },
      fragment: 'top',
      state: { returnUrl: this.router.url }
    };

    this.router.navigate(['/users'], navigationExtras);
  }
}
```

## Common Directives and Pipes

### Built-in Directives

Structural and attribute directives for common template operations.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- *ngIf -->
    <div *ngIf="isLoggedIn; else loginPrompt">
      Welcome back, {{ username }}!
    </div>
    <ng-template #loginPrompt>
      <p>Please log in</p>
    </ng-template>

    <!-- *ngFor -->
    <ul>
      <li *ngFor="let item of items; let i = index; let first = first; let last = last">
        {{ i + 1 }}. {{ item }}
        <span *ngIf="first">(first)</span>
        <span *ngIf="last">(last)</span>
      </li>
    </ul>

    <!-- *ngSwitch -->
    <div [ngSwitch]="userRole">
      <p *ngSwitchCase="'admin'">Admin Panel</p>
      <p *ngSwitchCase="'user'">User Dashboard</p>
      <p *ngSwitchDefault>Guest View</p>
    </div>

    <!-- [ngClass] -->
    <div [ngClass]="{
      'active': isActive,
      'disabled': !isEnabled,
      'highlighted': score > 50
    }">
      Dynamic classes
    </div>

    <!-- [ngStyle] -->
    <div [ngStyle]="{
      'color': textColor,
      'font-size.px': fontSize,
      'background-color': isHighlighted ? 'yellow' : 'white'
    }">
      Dynamic styles
    </div>

    <!-- ngTemplateOutlet -->
    <ng-container *ngTemplateOutlet="customTemplate; context: {$implicit: data}">
    </ng-container>

    <ng-template #customTemplate let-value>
      <p>Template content: {{ value }}</p>
    </ng-template>
  `
})
export class ExamplesComponent {
  isLoggedIn = true;
  username = 'John';
  items = ['Item 1', 'Item 2', 'Item 3'];
  userRole = 'admin';
  isActive = true;
  isEnabled = false;
  score = 75;
  textColor = 'blue';
  fontSize = 16;
  isHighlighted = true;
  data = { name: 'Sample' };
}
```

### Built-in Pipes

Transform data in templates for display.

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-pipe-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- AsyncPipe with Observable -->
    <p>Current time: {{ currentTime$ | async }}</p>

    <!-- Date pipe -->
    <p>{{ today | date:'short' }}</p>
    <p>{{ today | date:'fullDate' }}</p>
    <p>{{ today | date:'dd/MM/yyyy HH:mm' }}</p>

    <!-- Currency pipe -->
    <p>{{ price | currency:'USD':'symbol':'1.2-2' }}</p>
    <p>{{ price | currency:'EUR':'code' }}</p>

    <!-- Decimal pipe -->
    <p>{{ pi | number:'1.2-5' }}</p>

    <!-- Percent pipe -->
    <p>{{ ratio | percent:'1.0-2' }}</p>

    <!-- Uppercase/Lowercase -->
    <p>{{ text | uppercase }}</p>
    <p>{{ text | lowercase }}</p>
    <p>{{ text | titlecase }}</p>

    <!-- Slice pipe -->
    <p>{{ longText | slice:0:50 }}...</p>

    <!-- JSON pipe -->
    <pre>{{ user | json }}</pre>

    <!-- KeyValue pipe -->
    <div *ngFor="let item of user | keyvalue">
      {{ item.key }}: {{ item.value }}
    </div>
  `
})
export class PipeExamplesComponent {
  currentTime$: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );

  today = new Date();
  price = 1234.56;
  pi = 3.14159265359;
  ratio = 0.75;
  text = 'hello world';
  longText = 'This is a very long text that needs to be truncated for display';
  user = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };
}
```

## Animations

### Animation Triggers and States

Create smooth transitions and animations for components.

```typescript
import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-animated',
  standalone: true,
  template: `
    <button (click)="toggle()">Toggle</button>
    <button (click)="addItem()">Add Item</button>

    <div [@slideInOut]="isOpen ? 'in' : 'out'" class="panel">
      Sliding Panel
    </div>

    <div [@fadeInOut] *ngIf="showElement">
      Fading Element
    </div>

    <ul>
      <li *ngFor="let item of items" [@listAnimation]>
        {{ item }}
      </li>
    </ul>
  `,
  animations: [
    // Slide in/out animation with states
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      state('out', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      transition('in <=> out', animate('300ms ease-in-out'))
    ]),

    // Fade in/out
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ]),

    // List animation with stagger
    trigger('listAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100px)' }))
      ])
    ]),

    // Keyframes animation
    trigger('bounce', [
      transition('* => *', [
        animate('1s', keyframes([
          style({ transform: 'translateY(0)', offset: 0 }),
          style({ transform: 'translateY(-30px)', offset: 0.5 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class AnimatedComponent {
  isOpen = true;
  showElement = true;
  items = ['Item 1', 'Item 2', 'Item 3'];

  toggle() {
    this.isOpen = !this.isOpen;
  }

  addItem() {
    this.items.push(`Item ${this.items.length + 1}`);
  }
}
```

## Application Bootstrap

### Standalone Application Setup

Bootstrap modern Angular applications without NgModules.

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { AppComponent } from './app.component';

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    provideAnimations(),
    // Add custom providers
    { provide: API_BASE_URL, useValue: 'https://api.example.com' }
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/about">About</a>
        <a routerLink="/contact">Contact</a>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>
      <p>&copy; 2024 My App</p>
    </footer>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'My Angular App';
}
```

Angular is a complete framework for building professional web applications with enterprise-level features. It provides everything needed from development to production deployment including TypeScript support, comprehensive testing tools, performance optimization capabilities, and a rich ecosystem of libraries and tools. The framework's modular architecture allows developers to use only what they need while maintaining consistency across large applications.

The modern signal-based reactivity system offers improved performance through fine-grained reactivity without zone.js overhead. Standalone components eliminate the need for NgModules, simplifying application structure and improving tree-shaking. The framework's strong typing with TypeScript provides excellent IDE support and catches errors at compile time. Angular's opinionated structure and best practices make it ideal for large teams building maintainable, scalable applications with consistent code quality and patterns.
