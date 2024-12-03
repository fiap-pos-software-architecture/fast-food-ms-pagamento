import { TypeORMRepository } from './TypeORMRepository'; // ou o caminho correto do seu arquivo
import { DataSource, Repository } from 'typeorm';

// Entidade fictícia para teste
class TestEntity {
  id: number;
  name: string;
}

// Mocking Repository
const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  delete: jest.fn(),
  find: jest.fn(),
};

describe('TypeORMRepository', () => {
  let typeORMRepository: TypeORMRepository<any>;
  let mockDataSource: unknown; // Usar 'unknown' para evitar erro de compatibilidade

  beforeEach(() => {
    // Mock do DataSource para retornar o mockRepository
    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    };

    // Criando uma instância do TypeORMRepository
    typeORMRepository = new TypeORMRepository(mockDataSource as any, TestEntity);
  });

  it('should create an entity', async () => {
    const entityData = { id: 1, name: 'Test Entity' };

    mockRepository.create.mockReturnValue(entityData);
    mockRepository.save.mockResolvedValue(entityData);

    const result = await typeORMRepository.create(entityData);

    expect(mockRepository.create).toHaveBeenCalledWith(entityData);
    expect(mockRepository.save).toHaveBeenCalledWith(entityData);
    expect(result).toEqual(entityData);
  });

  it('should create multiple entities', async () => {
    const entitiesData = [{ id: 1, name: 'Entity 1' }, { id: 2, name: 'Entity 2' }];

    mockRepository.create.mockReturnValue(entitiesData);
    mockRepository.save.mockResolvedValue(entitiesData);

    const result = await typeORMRepository.createMany(entitiesData);

    expect(mockRepository.create).toHaveBeenCalledWith(entitiesData);
    expect(mockRepository.save).toHaveBeenCalledWith(entitiesData);
    expect(result).toEqual(entitiesData);
  });

  it('should save an entity', async () => {
    const entityData = { id: 1, name: 'Test Entity' };

    mockRepository.save.mockResolvedValue(entityData);

    const result = await typeORMRepository.save(entityData);

    expect(mockRepository.save).toHaveBeenCalledWith(entityData);
    expect(result).toEqual(entityData);
  });

  it('should find one entity by condition', async () => {
    const condition = { id: 1 };
    const entityData = { id: 1, name: 'Test Entity' };

    mockRepository.findOneBy.mockResolvedValue(entityData);

    const result = await typeORMRepository.findOneBy(condition);

    expect(mockRepository.findOneBy).toHaveBeenCalledWith(condition);
    expect(result).toEqual(entityData);
  });

  it('should delete an entity by id', async () => {
    const id = 1;
    const deleteResponse = { affected: 1 };

    mockRepository.delete.mockResolvedValue(deleteResponse);

    const result = await typeORMRepository.delete(id);

    expect(mockRepository.delete).toHaveBeenCalledWith(id);
    expect(result).toEqual(deleteResponse);
  });

  it('should find entities with options', async () => {
    const options = { where: { name: 'Test' } };
    const entitiesData = [{ id: 1, name: 'Test Entity' }];

    mockRepository.find.mockResolvedValue(entitiesData);

    const result = await typeORMRepository.find(options);

    expect(mockRepository.find).toHaveBeenCalledWith(options);
    expect(result).toEqual(entitiesData);
  });
});
