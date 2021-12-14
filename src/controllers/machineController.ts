import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse
} from 'tsoa';
import { IMachine } from '../entities/machine';
import {
  MachineService,
  MachineCreationParam
} from '../services/machineServices';

@Route('machines')
export class MachineController extends Controller {
  @Get('{machineId}')
  public async getMachine(
    @Path() machineId: string,
    @Query() ip?: string
  ): Promise<IMachine> {
    return new MachineService().get(machineId, ip);
  }

  @SuccessResponse('201', 'Created')
  @Post()
  public async createMachine(
    @Body() requestBody: MachineCreationParam
  ): Promise<void> {
    this.setStatus(201);
    new MachineService().create(requestBody);
    return;
  }
}
