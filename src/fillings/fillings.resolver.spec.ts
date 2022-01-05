import { Test, TestingModule } from '@nestjs/testing';
import { FillingsResolver } from './fillings.resolver';

describe('FillingsResolver', () => {
  let resolver: FillingsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FillingsResolver],
    }).compile();

    resolver = module.get<FillingsResolver>(FillingsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
