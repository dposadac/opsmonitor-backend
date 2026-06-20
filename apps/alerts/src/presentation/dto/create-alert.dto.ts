import { IsIn, IsString, MaxLength } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  incidentId: string;

  @IsIn(['email', 'sms', 'slack', 'webhook'])
  channel: string;

  @IsString()
  @MaxLength(500)
  message: string;
}
