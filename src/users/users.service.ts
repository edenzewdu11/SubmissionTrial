import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
  ) {}

  // Create user and include the role
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(createUserDto);

    // Ensure the role is set, defaulting to 'user' if not provided
    user.role = createUserDto.role || 'user'; // Default to 'user' if no role is provided

    const profile = this.profileRepo.create({
      fullName: `${createUserDto.firstName} ${createUserDto.lastName}`,
      email: createUserDto.email,
    });

    await this.profileRepo.save(profile);
    user.profile = profile;

    return this.userRepo.save(user);
  }

  // Adjusted findByEmail method to directly query User's email
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({
      where: { email }, // Directly query email from the User entity
      relations: ['profile'], // Still load the profile for related data
    });
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profile'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: number, updateData: UpdateUserDto): Promise<User> {
    const user = await this.getUserById(id);

    if (updateData.firstName || updateData.lastName) {
      const updatedFullName = `${updateData.firstName ?? user.profile.fullName.split(' ')[0]} ${updateData.lastName ?? user.profile.fullName.split(' ')[1]}`;
      await this.profileRepo.update(user.profile.id, {
        fullName: updatedFullName,
      });
    }

    if (updateData.email) {
      await this.profileRepo.update(user.profile.id, {
        email: updateData.email,
      });
    }

    if (updateData.role) {
      user.role = updateData.role; // Ensure the role can be updated
    }

    await this.userRepo.update(id, updateData);

    return this.getUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.profile) {
      await this.profileRepo.remove(user.profile);
    }

    await this.userRepo.remove(user);
  }

  async updateProfile(
    userId: number,
    profileData: Partial<CreateUserDto>,
  ): Promise<Profile> {
    const user = await this.getUserById(userId);
    const updatedProfile = await this.profileRepo.save({
      ...user.profile,
      ...profileData,
    });

    return updatedProfile;
  }
}
