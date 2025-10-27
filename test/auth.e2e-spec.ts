import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import request from 'supertest'
import { App } from 'supertest/types'
import { AuthController } from '@auth/presentation'
import { SignInUseCase, SignUpUseCase } from '@auth/usecases'
import {
  mockSignUpUseCaseParams,
  mockSignUpUseCaseResult,
  mockSignInUseCaseParams,
  mockSignInUseCaseResult
} from '@auth/__test__/usecases/mocks'

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>
  let signUpUseCase: SignUpUseCase
  let signInUseCase: SignInUseCase

  const signUpUseCaseMock = {
    signUp: jest.fn()
  }

  const signInUseCaseMock = {
    signIn: jest.fn()
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SignUpUseCase,
          useValue: signUpUseCaseMock
        },
        {
          provide: SignInUseCase,
          useValue: signInUseCaseMock
        }
      ]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()

    signUpUseCase = moduleFixture.get<SignUpUseCase>(SignUpUseCase)
    signInUseCase = moduleFixture.get<SignInUseCase>(SignInUseCase)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /sign-up', () => {
    it('should return status 201 on successful sign-up', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const signUpResult = mockSignUpUseCaseResult()
      signUpUseCaseMock.signUp.mockResolvedValue(signUpResult)

      const response = await request(app.getHttpServer()).post('/sign-up').send(signUpParams)

      expect(response.status).toBe(201)
    })

    it('should call SignUpUseCase with correct params', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const signUpSpy = jest.spyOn(signUpUseCase, 'signUp')

      await request(app.getHttpServer()).post('/sign-up').send(signUpParams)

      expect(signUpSpy).toHaveBeenCalledWith(signUpParams)
    })

    it('should return the auth token on successful sign-up', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const signUpResult = mockSignUpUseCaseResult()
      signUpUseCaseMock.signUp.mockResolvedValue(signUpResult)

      const response = await request(app.getHttpServer()).post('/sign-up').send(signUpParams)

      expect(response.body).toEqual(signUpResult)
    })

    it('should return status 400 if name is not provided', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ ...signUpParams, name: undefined })
      expect(response.status).toBe(400)
    })

    it('should return status 400 if email is not provided', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ ...signUpParams, email: undefined })
      expect(response.status).toBe(400)
    })

    it('should return status 400 if password is not provided', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ ...signUpParams, password: undefined })
      expect(response.status).toBe(400)
    })

    it('should return status 400 if passwordConfirmation is not provided', async () => {
      const signUpParams = mockSignUpUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-up')
        .send({ ...signUpParams, passwordConfirmation: undefined })
      expect(response.status).toBe(400)
    })
  })

  describe('POST /sign-in', () => {
    it('should return status 200 on successful sign-in', async () => {
      const signInParams = mockSignInUseCaseParams()
      const signInResult = mockSignInUseCaseResult()
      signInUseCaseMock.signIn.mockResolvedValue(signInResult)

      const response = await request(app.getHttpServer()).post('/sign-in').send(signInParams)

      expect(response.status).toBe(200)
    })

    it('should call SignInUseCase with correct params', async () => {
      const signInParams = mockSignInUseCaseParams()
      const signInSpy = jest.spyOn(signInUseCase, 'signIn')

      await request(app.getHttpServer()).post('/sign-in').send(signInParams)

      expect(signInSpy).toHaveBeenCalledWith(signInParams)
    })

    it('should return the auth token on successful sign-in', async () => {
      const signInParams = mockSignInUseCaseParams()
      const signInResult = mockSignInUseCaseResult()
      signInUseCaseMock.signIn.mockResolvedValue(signInResult)

      const response = await request(app.getHttpServer()).post('/sign-in').send(signInParams)

      expect(response.body).toEqual(signInResult)
    })

    it('should return status 400 if email is not provided', async () => {
      const signInParams = mockSignInUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-in')
        .send({ ...signInParams, email: undefined })
      expect(response.status).toBe(400)
    })

    it('should return status 400 if password is not provided', async () => {
      const signInParams = mockSignInUseCaseParams()
      const response = await request(app.getHttpServer())
        .post('/sign-in')
        .send({ ...signInParams, password: undefined })
      expect(response.status).toBe(400)
    })
  })
})
