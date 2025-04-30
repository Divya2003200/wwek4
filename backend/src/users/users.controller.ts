
import { Controller, Get, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Skill } from 'src/skills/skill.entity';


@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  
  @Get('me')
getProfile(@Req() req) {
 
  return this.usersService.findById(req.user.id);
}


@Patch('me')
updateProfile(@Req() req, @Body() dto: UpdateUserDto) {
  // read the real User.id
  return this.usersService.update(req.user.id, dto);
}



@Patch('me/skills')
updateSkills(@Req() req, @Body() skills: Skill[]) {
  return this.usersService.updateSkills(req.user.id, skills);
}

}
