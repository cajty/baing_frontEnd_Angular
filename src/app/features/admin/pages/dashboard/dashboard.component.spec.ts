import { User, UserRequest } from "../../../../core/models/user.interface";
import { DashboardComponent } from "./dashboard.component";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { UserService } from "../../../../core/services/user.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of, throwError } from "rxjs";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let userService: jasmine.SpyObj<UserService>;

  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      age: 30,
      monthlyIncome: 5000,
      creditScore: 750,
      role: 'USER',
      accountIds: [101, 102],
      invoiceIds: [201, 202],
      loanIds: [301, 302]
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 25,
      monthlyIncome: 4000,
      creditScore: 680,
      role: 'ADMIN',
      accountIds: [103],
      invoiceIds: [203],
      loanIds: [303]
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getAllUsers',
      'createUser',
      'deleteUser'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, DashboardComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Reset component state and spies after each test
    userService.getAllUsers.calls.reset();
    userService.createUser.calls.reset();
    userService.deleteUser.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Lifecycle', () => {
    beforeEach(() => {
      // Set default success response
      userService.getAllUsers.and.returnValue(of([]));
    });

    it('should initialize with default values', fakeAsync(() => {
      component.ngOnInit();
      tick();

      expect(component.users).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
      expect(component.showModal).toBeFalse();
      expect(component.isEditing).toBeFalse();
    }));

    it('should clean up subscriptions on destroy', fakeAsync(() => {
      const subscription = component['destroy$'].subscribe();
      component.ngOnDestroy();
      tick();
      expect(subscription.closed).toBeTrue();
    }));
  });

  describe('Data Loading', () => {
    beforeEach(() => {
      // Reset component state
      component.users = [];
      component.loading = true;
      component.error = null;
    });

    it('should load users successfully on init', fakeAsync(() => {
      userService.getAllUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();
      tick();

      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBeFalse();
      expect(component.error).toBeNull();
      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    }));

    it('should handle network error when loading users', fakeAsync(() => {
      userService.getAllUsers.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();
      tick();

      expect(component.users).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.error).toBe('Failed to load users. Please try again.');
      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Modal Operations', () => {
    beforeEach(() => {
      component.error = null;
      component.showModal = false;
      component.isEditing = false;
      userService.getAllUsers.and.returnValue(of([]));
    });

    it('should properly initialize add modal', () => {
      component.openAddModal();

      expect(component.isEditing).toBeFalse();
      expect(component.showModal).toBeTrue();
      expect(component.currentUser).toEqual({
        name: '',
        age: 0,
        monthlyIncome: 0,
        creditScore: 0,
        role: ''
      });
      expect(component.error).toBeNull();
    });

    it('should properly initialize edit modal with user data', () => {
      const userToEdit = mockUsers[0];
      component.openEditModal(userToEdit);

      expect(component.isEditing).toBeTrue();
      expect(component.showModal).toBeTrue();
      expect(component.currentUser).toEqual({
        name: userToEdit.name,
        age: userToEdit.age,
        monthlyIncome: userToEdit.monthlyIncome,
        creditScore: userToEdit.creditScore,
        role: userToEdit.role
      } as UserRequest);
      expect(component.error).toBeNull();
    });
  });

  describe('User Management', () => {
    describe('User Validation', () => {
      beforeEach(() => {
        component.error = null;
      });

      it('should reject empty name', () => {
        component.currentUser = {
          name: '',
          age: 25,
          monthlyIncome: 5000,
          creditScore: 700,
          role: 'USER'
        };
        component.saveUser();
        expect(component.error).toBe('Please fill all fields with valid values.');
      });

      it('should reject invalid age', () => {
        component.currentUser = {
          name: 'Test User',
          age: 0,
          monthlyIncome: 5000,
          creditScore: 700,
          role: 'USER'
        };
        component.saveUser();
        expect(component.error).toBe('Please fill all fields with valid values.');
      });

      it('should reject negative monthly income', () => {
        component.currentUser = {
          name: 'Test User',
          age: 25,
          monthlyIncome: -100,
          creditScore: 700,
          role: 'USER'
        };
        component.saveUser();
        expect(component.error).toBe('Please fill all fields with valid values.');
      });

      it('should reject credit score outside valid range', () => {
        component.currentUser = {
          name: 'Test User',
          age: 25,
          monthlyIncome: 5000,
          creditScore: 299,
          role: 'USER'
        };
        component.saveUser();
        expect(component.error).toBe('Please fill all fields with valid values.');

        component.currentUser.creditScore = 851;
        component.saveUser();
        expect(component.error).toBe('Please fill all fields with valid values.');
      });
    });

    describe('Save Operations', () => {
      const validUser: UserRequest = {
        name: 'New User',
        age: 25,
        monthlyIncome: 3000,
        creditScore: 700,
        role: 'USER'
      };

      beforeEach(() => {
        component.currentUser = { ...validUser };
        component.error = null;
        userService.getAllUsers.and.returnValue(of(mockUsers));
      });

      it('should successfully save valid user data', fakeAsync(() => {
     userService.createUser.and.returnValue(of({
    id: 3,
    name: 'New User',
    age: 25,
    monthlyIncome: 3000,
    creditScore: 700,
    role: 'USER',
    accountIds: [],
    invoiceIds: [],
    loanIds: []
}));


        component.saveUser();
        tick();

        expect(userService.createUser).toHaveBeenCalledWith(validUser);
        expect(component.showModal).toBeFalse();
        expect(component.error).toBeNull();
      }));

      it('should handle save error appropriately', fakeAsync(() => {
        userService.createUser.and.returnValue(throwError(() => new Error('Save failed')));

        component.saveUser();
        tick();

        expect(userService.createUser).toHaveBeenCalledWith(validUser);
        expect(component.error).toBe('Failed to save user. Please try again.');
      }));
    });

    describe('Delete Operations', () => {
      beforeEach(() => {
        component.error = null;
        component.users = [...mockUsers];
        userService.getAllUsers.and.returnValue(of(mockUsers.slice(1)));
        spyOn(window, 'confirm').and.returnValue(true);
      });

      it('should successfully delete user', fakeAsync(() => {
        userService.deleteUser.and.returnValue(of(void 0));

        component.deleteUser(1);
        tick();

        expect(userService.deleteUser).toHaveBeenCalledWith(1);
        expect(component.error).toBeNull();
      }));

      it('should handle delete error appropriately', fakeAsync(() => {
        userService.deleteUser.and.returnValue(throwError(() => new Error('Delete failed')));

        component.deleteUser(1);
        tick();

        expect(userService.deleteUser).toHaveBeenCalledWith(1);
        expect(component.error).toBe('Failed to delete user. Please try again.');
      }));
    });
  });

  describe('UI Helper Functions', () => {
    it('should return appropriate credit score classes', () => {
      expect(component.getCreditScoreClass(750)).toBe('text-green-600');
      expect(component.getCreditScoreClass(650)).toBe('text-yellow-600');
      expect(component.getCreditScoreClass(550)).toBe('text-red-600');
    });
  });
});
