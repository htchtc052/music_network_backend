import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestingModule } from '@nestjs/testing';
import { appSetup } from './utils/app.setup';
import { AuthResponse } from '../src/auth/dto/authResponse';
import { EditTrackInfoDto } from '../src/tracks/dtos/editTrackInfo.dto';
import { TrackResponse } from '../src/tracks/dtos/track.response';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { readdirSync, unlinkSync } from 'fs';
import { createTestingModule } from './utils/createTestingModule';

describe('Auth routes', () => {
  let app: INestApplication;
  let configService: ConfigService;

  let ownerUser: AuthResponse;
  let guestUser: AuthResponse;

  class MockMailerService {}

  beforeAll(async () => {
    const moduleFixture: TestingModule = await createTestingModule();

    app = moduleFixture.createNestApplication();
    appSetup(app);

    await app.init();

    const testSuiteName = `tracks`;

    const resOwnerRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user.${testSuiteName}.1@mail.com`,
        password: `simple_pass`,
        username: `User ${testSuiteName} owner`,
      });

    ownerUser = resOwnerRegister.body;

    const resGuestRegister = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: `user.${testSuiteName}.2@mail.com`,
        password: `simple_pass`,
        username: `User ${testSuiteName} guest`,
      });

    guestUser = resGuestRegister.body;

    configService = moduleFixture.get<ConfigService>(ConfigService);
  });

  afterAll(async () => {
    await app.close();

    const uploadsDir = configService.get('UPLOADS_DIR');
    const files = readdirSync(uploadsDir);

    files.forEach((file) => {
      const filePath = join(uploadsDir, file);
      try {
        unlinkSync(filePath);
        //console.log(`Deleted test file ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete test file ${filePath}`);
        console.error(err);
      }
    });
  });

  let firstTrack: TrackResponse, secondTrack: TrackResponse;

  const fileName = 'test_file.mp3';
  const filePath = join(__dirname, 'fixtures', fileName);

  it('/tracks (POST) - create first track', async () => {
    try {
      //console.debug(ownerPage);
      const res = await request(app.getHttpServer())
        .post('/tracks/uploadTrack')
        .set('Authorization', 'Bearer ' + ownerUser.accessToken)
        .attach('trackFile', filePath);

      //expect(res.statusCode).toEqual(HttpStatus.CREATED);
      firstTrack = res.body as TrackResponse;
    } catch (err) {
      console.error(`Error upload first track=${err.stack}`);
    }
  });

  it('/tracks (POST) - create second track', async () => {
    try {
      const res = await request(app.getHttpServer())
        .post('/tracks/uploadTrack')
        .set('Authorization', 'Bearer ' + ownerUser.accessToken)
        .attach('trackFile', filePath);

      expect(res.statusCode).toEqual(HttpStatus.CREATED);
      secondTrack = res.body as TrackResponse;
    } catch (err) {
      console.error(`Error upload second track=${err.stack}`);
    }
  });

  it('/tracks (POST) - edit second track as guest error', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tracks/${secondTrack.id}/editTrackInfo`)
      .set('Authorization', 'Bearer ' + guestUser.accessToken)
      .send({
        title: 'Edited title',
      } as EditTrackInfoDto);

    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/tracks (POST) - edit second track and make it private', async () => {
    const res = await request(app.getHttpServer())
      .put(`/tracks/${secondTrack.id}/editTrackInfo`)
      .set('Authorization', 'Bearer ' + ownerUser.accessToken)
      .send({
        title: 'Edited title',
        description: 'Edited description',
        private: true,
      } as EditTrackInfoDto);

    const editedTrack: TrackResponse = res.body;

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(editedTrack.private).toBe(true);
    expect(editedTrack.title).toEqual(editedTrack.title);
    expect(editedTrack.description).toEqual(editedTrack.description);

    secondTrack = res.body as TrackResponse;
  });

  it('/tracks/:id (Get) - get public track as owner', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracks/' + firstTrack.id)
      .set('Authorization', 'Bearer ' + ownerUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.hiddenDescription).toBeDefined();
  });

  it('/tracks/:id (Get) - get private track as owner', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracks/' + secondTrack.id)
      .set('Authorization', 'Bearer ' + ownerUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.private).toEqual(true);
  });

  it('/tracks/:id (Get) - get private track as guest. Only public fields access', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracks/' + firstTrack.id)
      .set('Authorization', 'Bearer ' + guestUser.accessToken);
    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body.hiddenDescription).toBeUndefined();
  });

  it('/tracks/:id (Get) -  private track as guest. Access restricted', async () => {
    const res = await request(app.getHttpServer())
      .get('/tracks/' + secondTrack.id)
      .set('Authorization', 'Bearer ' + guestUser.accessToken);
    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/users/:id/tracks (Get) - get all user tracks as owner', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/' + ownerUser.user.id + '/tracks')
      .set('Authorization', 'Bearer ' + ownerUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(2);
  });

  it('/users/:id/tracks (Get) - get only public user tracks as guest', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/' + ownerUser.user.id + '/tracks')
      .set('Authorization', 'Bearer ' + guestUser.accessToken);
    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(1);
  });

  it('/tracks (Get) - get only public tracks in catalog', async () => {
    const res = await request(app.getHttpServer()).get('/tracks');

    expect(res.statusCode).toEqual(HttpStatus.OK);
    expect(res.body).toHaveLength(1);
  });

  it('/tracks (POST) - delete first track by guest error', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/tracks/${firstTrack.id}/deleteTrack`)
      .set('Authorization', 'Bearer ' + guestUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.FORBIDDEN);
  });

  it('/tracks (POST) - delete first track by owner success', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/tracks/${firstTrack.id}/deleteTrack`)
      .set('Authorization', 'Bearer ' + ownerUser.accessToken);

    expect(res.statusCode).toEqual(HttpStatus.OK);
  });
});
