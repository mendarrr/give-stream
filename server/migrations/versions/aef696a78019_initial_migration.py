<<<<<<< HEAD:server/migrations/versions/aef696a78019_initial_migration.py
"""Initial migration

Revision ID: aef696a78019
Revises: 
Create Date: 2024-08-11 22:27:15.397174
=======
"""initializing database

Revision ID: 35e1ac497596
Revises: 
Create Date: 2024-08-12 09:40:45.945458
>>>>>>> models:server/migrations/versions/35e1ac497596_initializing_database.py

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
<<<<<<< HEAD:server/migrations/versions/aef696a78019_initial_migration.py
revision = 'aef696a78019'
=======
revision = '35e1ac497596'
>>>>>>> models:server/migrations/versions/35e1ac497596_initializing_database.py
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('admins',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('charities',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('needed_donation', sa.Float(), nullable=True),
    sa.Column('raised_amount', sa.Float(), nullable=True),
    sa.Column('goal_amount', sa.Float(), nullable=True),
    sa.Column('donation_count', sa.Integer(), nullable=True),
    sa.Column('image_url', sa.String(length=255), nullable=True),
    sa.Column('organizer', sa.String(length=128), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name'),
    sa.UniqueConstraint('username')
    )
    op.create_table('community',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('members', sa.Integer(), nullable=False),
    sa.Column('impact_stories', sa.Text(), nullable=False),
    sa.Column('events', sa.Text(), nullable=False),
    sa.Column('banner', sa.String(length=255), nullable=False),
    sa.Column('category', sa.String(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.Column('is_answered', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('transaction_id', sa.String(length=100), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('payment_methods',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('beneficiaries',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('charity_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['charity_id'], ['charities.id'], name=op.f('fk_beneficiaries_charity_id_charities')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('charity_applications',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('status', sa.String(length=20), nullable=True),
    sa.Column('submission_date', sa.DateTime(), nullable=True),
    sa.Column('reviewed_by', sa.Integer(), nullable=True),
    sa.Column('review_date', sa.DateTime(), nullable=True),
    sa.Column('country', sa.String(length=100), nullable=True),
    sa.Column('city', sa.String(length=100), nullable=True),
    sa.Column('zipcode', sa.String(length=20), nullable=True),
    sa.Column('fundraising_category', sa.String(length=100), nullable=True),
    sa.Column('username', sa.String(length=256), nullable=True),
    sa.Column('target_amount', sa.Float(), nullable=True),
    sa.Column('image', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['reviewed_by'], ['admins.id'], name=op.f('fk_charity_applications_reviewed_by_admins')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('donors',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('_password_hash', sa.String(), nullable=True),
    sa.Column('is_anonymous', sa.Boolean(), nullable=True),
    sa.Column('role', sa.String(length=20), nullable=True),
    sa.Column('payment_method_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['payment_method_id'], ['payment_methods.id'], name=op.f('fk_donors_payment_method_id_payment_methods')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('inventories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('charity_id', sa.Integer(), nullable=False),
    sa.Column('item_name', sa.String(length=128), nullable=False),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('last_updated', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['charity_id'], ['charities.id'], name=op.f('fk_inventories_charity_id_charities')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('stories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('charity_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=128), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('date_posted', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['charity_id'], ['charities.id'], name=op.f('fk_stories_charity_id_charities')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('donations',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('donor_id', sa.Integer(), nullable=False),
    sa.Column('charity_id', sa.Integer(), nullable=False),
    sa.Column('payment_method_id', sa.Integer(), nullable=False),
    sa.Column('amount', sa.Float(), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=True),
    sa.Column('is_anonymous', sa.Boolean(), nullable=True),
    sa.Column('is_recurring', sa.Boolean(), nullable=True),
    sa.Column('recurring_frequency', sa.String(length=20), nullable=True),
    sa.Column('next_donation_date', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['charity_id'], ['charities.id'], name=op.f('fk_donations_charity_id_charities'), ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['donor_id'], ['donors.id'], name=op.f('fk_donations_donor_id_donors')),
    sa.ForeignKeyConstraint(['payment_method_id'], ['payment_methods.id'], name=op.f('fk_donations_payment_method_id_payment_methods')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('donations')
    op.drop_table('stories')
    op.drop_table('inventories')
    op.drop_table('donors')
    op.drop_table('charity_applications')
    op.drop_table('beneficiaries')
    op.drop_table('payment_methods')
    op.drop_table('payment')
    op.drop_table('message')
    op.drop_table('community')
    op.drop_table('charities')
    op.drop_table('admins')
    # ### end Alembic commands ###
