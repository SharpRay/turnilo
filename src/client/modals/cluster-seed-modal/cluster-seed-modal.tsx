/*
 * Copyright 2015-2016 Imply Data, Inc.
 * Copyright 2017-2018 Allegro.pl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { Cluster } from "../../../common/models/cluster/cluster";
import { CLUSTER as LABELS } from "../../../common/models/labels";
import { indexByAttribute } from "../../../common/utils/array/array";
import { generateUniqueName } from "../../../common/utils/string/string";
import { Button } from "../../components/button/button";
import { FormLabel } from "../../components/form-label/form-label";
import { ImmutableDropdown } from "../../components/immutable-dropdown/immutable-dropdown";
import { ImmutableInput } from "../../components/immutable-input/immutable-input";
import { Modal } from "../../components/modal/modal";
import { STRINGS } from "../../config/constants";
import { ImmutableFormDelegate, ImmutableFormState } from "../../utils/immutable-form-delegate/immutable-form-delegate";
import "./cluster-seed-modal.scss";

export interface ClusterSeedModalProps {
  onNext: (newCluster: Cluster) => void;
  onCancel: () => void;
  clusters: Cluster[];
}

export class ClusterSeedModal extends React.Component<ClusterSeedModalProps, ImmutableFormState<Cluster>> {
  private delegate: ImmutableFormDelegate<Cluster>;

  constructor(props: ClusterSeedModalProps) {
    super(props);
    this.delegate = new ImmutableFormDelegate<Cluster>(this);
  }

  initFromProps(props: ClusterSeedModalProps) {
    const clusters = props.clusters;

    if (!clusters) return;

    this.setState({
      newInstance: new Cluster({
        name: generateUniqueName("cl", name => indexByAttribute(clusters, "name", name) === -1),
        type: "druid"
      })
    });
  }

  componentWillReceiveProps(nextProps: ClusterSeedModalProps) {
    this.initFromProps(nextProps);
  }

  componentDidMount() {
    this.initFromProps(this.props);
  }

  onNext() {
    this.props.onNext(this.state.newInstance);
  }

  render(): JSX.Element {
    const { onNext, onCancel } = this.props;
    const { newInstance, errors } = this.state;

    if (!newInstance) return null;

    var makeLabel = FormLabel.simpleGenerator(LABELS, errors, true);
    var makeTextInput = ImmutableInput.simpleGenerator(newInstance, this.delegate.onChange);
    var makeDropDownInput = ImmutableDropdown.simpleGenerator(newInstance, this.delegate.onChange);

    return <Modal
      className="cluster-seed-modal"
      title={STRINGS.connectNewCluster}
      onClose={this.props.onCancel}
    >
      <form>
        {makeLabel("type")}
        {makeDropDownInput("type", Cluster.TYPE_VALUES.map(type => ({ value: type, label: type })))}

        {makeLabel("host")}
        {makeTextInput("host", /^.+$/)}

      </form>
      <div className="button-bar">
        <Button type="primary" title={`${STRINGS.next}: ${STRINGS.configureCluster}`} onClick={this.onNext.bind(this)} />
        <Button className="cancel" title="Cancel" type="secondary" onClick={onCancel} />
      </div>

    </Modal>;
  }
}
