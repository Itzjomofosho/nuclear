import {Behavior, BehaviorContext} from "../../../Core/Behavior";
import * as bt from '../../../Core/BehaviorTree';
import Specialization from '../../../Enums/Specialization';
import common from '../../../Core/Common';
import spell from "../../../Core/Spell";
import {me} from "../../../Core/ObjectManager";

export class DeathKnightFrostBehavior extends Behavior {
  context = BehaviorContext.Any; // PVP ?
  specialization = Specialization.DeathKnight.Frost;
  version = wow.GameVersion.Retail;

  build() {
    return new bt.Decorator(
      ret => !spell.isGlobalCooldown(),
      new bt.Selector(
        common.waitForTarget(),
        common.waitForCastOrChannel(),
        spell.cast("Death Strike", ret =>  me.pctHealth < 95 && me.hasAura(101568)), // dark succor
        spell.cast("Death Strike", ret => me.pctHealth < 65 && me.power > 35),
        spell.cast("Pillar of Frost", on => me, ret => me.target && me.isWithinMeleeRange(me.target)),
        spell.cast("Remorseless Winter", on => me, ret => me.target && me.isWithinMeleeRange(me.target)),
        this.multiTargetRotation(),
        spell.cast("Rune Strike", ret =>  me.hasAura(51124)), // killing machine aura
        spell.cast("Howling Blast", ret =>  me.hasAura(59052)), // Rime aura
        spell.cast("Chains of Ice", ret => {
          const coldHeart = me.getAura(281209);
          return coldHeart && coldHeart.stacks === 20;
        }),
        spell.cast("Frost Strike", ret => me.power > 45),
        spell.cast("Rune Strike"),
      )
    );
  }

  singleTargetRotation() {
    return new bt.Sequence(
      spell.cast("Rune Strike", ret =>  me.hasAura(51124)), // killing machine aura
      spell.cast("Howling Blast", ret =>  me.hasAura(59052)), // Rime aura
      spell.cast("Frost Strike", ret => me.power > 45),
      spell.cast("Rune Strike"),
    );
  }

  multiTargetRotation() {
    return new bt.Sequence(
      spell.cast("Death and Decay", ret => me.unitsAroundCount(10) >= 2 && me.target && me.isWithinMeleeRange(me.target) && me.hasAura(51271)), // Pillar of Frost
    );
  }


}
