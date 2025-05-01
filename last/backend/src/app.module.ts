
// import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { RequestLoggingMiddleware } from './middleware/request-login.middleware';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';
// import { User } from './users/user.entity';
// import { Role } from './common/role.entity';
// import { ProjectsController } from './projects/projects.controller';
// import { ProjectsService } from './projects/projects.service';
// import { ProjectsModule } from './projects/projects.module';
// import { BidsService } from './bids/bids.service';
// import { BidsController } from './bids/bids.controller';
// import { BidsModule } from './bids/bids.module';
// import { MessagesModule } from './messages/messages.module';
// import { MilestonesController } from './milestones/milestones.controller';
// import { MilestonesService } from './milestones/milestones.service';
// import { MilestonesModule } from './milestones/milestones.module';
// import { InvoicesService } from './invoices/invoices.service';
// import { InvoicesController } from './invoices/invoices.controller';
// import { InvoicesModule } from './invoices/invoices.module';
// import { FilesController } from './files/files.controller';
// import { FilesModule } from './files/files.module';
// import { SkillsService } from './skills/skills.service';
// import { SkillsController } from './skills/skills.controller';
// import { SkillsModule } from './skills/skills.module';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'root123',
//       database: 'skillsync',
//       entities: [User, Role],
//       synchronize: true,
//       logging: true,
//     }),
//     MailerModule.forRoot({
//       transport: {
//         host: 'smtp.gmail.com', // replace with your SMTP server
//         port: 587,
//         secure: false,
//         auth: {
//           user: 'divyaverekar3@gmail.com',
//           pass: 'oqsw vped uxzo yvuh',
//         },
//       },
//       defaults: {
//       from: '"Divya Verekar" <divyaverekar3@gmail.com>'
//       },
     
//       template: {
//         dir: './src/auth/templates',
//         adapter: new HandlebarsAdapter(),
//         options: {
//           strict: true,
//         },
//       },
//     }),
//     AuthModule,
//     UsersModule,
//     ProjectsModule,
//     BidsModule,
//     MessagesModule,
//     MilestonesModule,
//     InvoicesModule,
//     FilesModule,
//     SkillsModule,
//   ],
//   controllers: [AppController, ProjectsController, BidsController, MilestonesController, InvoicesController, FilesController, SkillsController],
//   providers: [AppService, ProjectsService, BidsService, MilestonesService, InvoicesService, SkillsService],
// })
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(RequestLoggingMiddleware).forRoutes('*');
//   }
// }
// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule }   from '@nestjs/typeorm';
import { MailerModule }    from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { AppController }     from './app.controller';
import { AppService }        from './app.service';
import { RequestLoggingMiddleware } from './middleware/request-login.middleware';

import { AuthModule }     from './auth/auth.module';
import { UsersModule }    from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { BidsModule }     from './bids/bids.module';
import { MessagesModule } from './messages/messages.module';
import { MilestonesModule } from './milestones/milestones.module';
import { InvoicesModule }   from './invoices/invoices.module';
import { FilesModule }      from './files/files.module';
import { SkillsModule }     from './skills/skills.module';
import { User } from './users/user.entity';
import { Role } from './common/role.entity';
import { Project } from './projects/project.entity';
import { Invoice } from './invoices/invoice.entity';
import { Skill } from './skills/skill.entity';
import { File } from './files/file.entity';
import { Milestone } from './milestones/milestone.entity';
import { Bid } from './bids/bids.entity';
import { Message } from './messages/message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:       'mysql',
      host:       'localhost',
      port:       3306,
      username:   'root',
      password:   'root123',
      database:   'skillsync',
      // either list every entity here:
      entities: 
        [User, Role,Project,Invoice,Skill,File,Milestone,Bid,Message],
      synchronize: true,
      logging:     true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'you@example.com',
          pass: 'your-app-password',
        },
      },
      defaults: { from: '"No Reply" <no-reply@example.com>' },
      template: {
        dir:    './src/auth/templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    BidsModule,
    MessagesModule,
    MilestonesModule,
    InvoicesModule,
    FilesModule,
    SkillsModule,
  ],
  controllers: [AppController],        // only your root controller
  providers:   [AppService],           // only your root service
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
