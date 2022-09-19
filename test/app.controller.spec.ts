import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../src/controllers/app.controller';
import { AppService } from '../src/infrastructure/services/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return health check ok', () => {
      expect(appController.getHealth()).toBe({ message: 'ok' });
    });
  });
});
