import { options } from '../../ormconfig';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({ ...options });

export default AppDataSource;
