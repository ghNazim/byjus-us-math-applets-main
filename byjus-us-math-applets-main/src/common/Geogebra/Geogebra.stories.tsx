import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Geogebra } from './Geogebra'

const meta: Meta<typeof Geogebra> = {
  component: Geogebra,
}
export default meta
type Story = StoryObj<typeof Geogebra>

export const Sample: Story = {
  args: {
    materialId: 'jusnnrwa',
  },
  render: (args) => (
    <>
      <Geogebra {...args} />
      <p style={{ fontSize: '40px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Vulputate eu scelerisque felis imperdiet proin fermentum leo.
        Enim neque volutpat ac tincidunt vitae semper quis lectus. Tempus imperdiet nulla malesuada
        pellentesque elit eget gravida cum. Sed turpis tincidunt id aliquet risus feugiat in ante. A
        scelerisque purus semper eget duis. Sit amet consectetur adipiscing elit. Commodo quis
        imperdiet massa tincidunt nunc pulvinar sapien et ligula. Cursus risus at ultrices mi. Lacus
        luctus accumsan tortor posuere. Semper viverra nam libero justo laoreet sit amet cursus.
        Urna nec tincidunt praesent semper feugiat nibh sed pulvinar proin. Eget felis eget nunc
        lobortis mattis. Nisi lacus sed viverra tellus in hac. Quis viverra nibh cras pulvinar
        mattis nunc sed blandit. In hac habitasse platea dictumst vestibulum. Sit amet commodo nulla
        facilisi nullam vehicula ipsum a arcu. Et odio pellentesque diam volutpat commodo sed.
        Dictum varius duis at consectetur lorem. Vitae elementum curabitur vitae nunc sed. Auctor
        augue mauris augue neque gravida in fermentum et sollicitudin. Pellentesque habitant morbi
        tristique senectus et netus. Adipiscing bibendum est ultricies integer quis auctor elit.
        Ultrices eros in cursus turpis massa tincidunt dui ut. Vulputate mi sit amet mauris.
        Ullamcorper a lacus vestibulum sed. In egestas erat imperdiet sed euismod. Integer quis
        auctor elit sed vulputate mi sit. Luctus accumsan tortor posuere ac ut consequat semper
        viverra nam. Porta nibh venenatis cras sed felis eget. Dolor sed viverra ipsum nunc aliquet
        bibendum enim facilisis gravida. Sed arcu non odio euismod lacinia. Egestas integer eget
        aliquet nibh praesent tristique magna. Porta non pulvinar neque laoreet suspendisse
        interdum. Vitae congue mauris rhoncus aenean vel elit scelerisque mauris pellentesque.
        Molestie nunc non blandit massa enim nec. Ac felis donec et odio pellentesque. Mi in nulla
        posuere sollicitudin aliquam. In iaculis nunc sed augue lacus viverra vitae congue eu. Quam
        adipiscing vitae proin sagittis nisl rhoncus. Auctor eu augue ut lectus arcu bibendum at.
        Senectus et netus et malesuada fames. Condimentum id venenatis a condimentum. Nulla aliquet
        enim tortor at auctor urna nunc. Est ultricies integer quis auctor elit sed vulputate mi
        sit. Molestie at elementum eu facilisis sed odio. Gravida dictum fusce ut placerat orci
        nulla pellentesque dignissim. Aliquet risus feugiat in ante metus. Gravida rutrum quisque
        non tellus orci. Hendrerit gravida rutrum quisque non tellus orci ac. Dignissim enim sit
        amet venenatis urna cursus eget nunc. Donec et odio pellentesque diam volutpat. Sapien eget
        mi proin sed libero enim sed faucibus. Sed enim ut sem viverra. Ut pharetra sit amet aliquam
        id diam maecenas ultricies. Netus et malesuada fames ac turpis egestas. Suscipit adipiscing
        bibendum est ultricies integer quis. Tempor orci eu lobortis elementum nibh tellus molestie
        nunc. In cursus turpis massa tincidunt dui ut ornare lectus. Aliquet sagittis id consectetur
        purus ut faucibus pulvinar. Egestas erat imperdiet sed euismod nisi porta lorem mollis.
        Velit ut tortor pretium viverra suspendisse potenti nullam ac tortor. Sit amet nisl purus in
        mollis nunc. Dignissim convallis aenean et tortor at risus. Sed felis eget velit aliquet.
        Pulvinar proin gravida hendrerit lectus. Facilisis gravida neque convallis a. Pretium nibh
        ipsum consequat nisl vel pretium. Non odio euismod lacinia at quis risus sed vulputate odio.
        Risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Eget nulla facilisi
        etiam dignissim diam quis enim lobortis scelerisque. Arcu odio ut sem nulla pharetra diam
        sit. Neque egestas congue quisque egestas diam in arcu cursus euismod. In egestas erat
        imperdiet sed euismod nisi. Nunc scelerisque viverra mauris in aliquam. Eu facilisis sed
        odio morbi quis commodo.
      </p>
    </>
  ),
}
