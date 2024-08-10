import { Behavior, BehaviorContext } from "../../../Core/Behavior";
import * as bt from '../../../Core/BehaviorTree';
import Specialization from '../../../Core/Specialization';
import common from '../../../Core/Common';
import spell from "../../../Core/Spell";

export class WarriorFuryBehavior extends Behavior {
  context = BehaviorContext.Any;
  specialization = Specialization.Warrior.Fury;
  version = wow.GameVersion.Retail;

  build() {
    return new bt.Decorator(
      ret => !spell.isGlobalCooldown(),
      new bt.Selector(
        common.waitForTarget(),
        common.waitForCastOrChannel(),

        spell.cast("Execute", null, null, ret => true),
        spell.cast("Rampage", null, ret => true, null),
        spell.cast("Raging Blow", ret => false),
        //spell.cast("Bloodbath"),
        spell.cast("Bloodthirst"),
        spell.cast("Whirlwind"),
      )
    );
  }
}
